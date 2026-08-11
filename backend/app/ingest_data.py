import csv
import logging
import os

from config.config import CONFIG
from .data_reader import DataReader
from .state import last_error, last_row

filename = CONFIG["csv"]["filename"]
fieldnames = CONFIG["fieldnames"]

LOG_INTERVAL_ROWS = 1000
MAX_TIMEOUTS = 10

logger = logging.getLogger(__name__)


def _exception_to_dict(exception: Exception) -> dict:
    return {"type": type(exception).__name__, "message": str(exception)}


def _ensure_header_exists():
    """Writes header only if file does not exist or is completely empty."""
    if not os.path.exists(filename) or os.path.getsize(filename) == 0:
        with open(filename, "w", newline="") as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()


def ingest_data(use_mock_data: bool = False):
    data_reader = DataReader(use_mock_data)
    _ensure_header_exists()

    consecutive_timeouts = 0
    received_rows = 0

    logger.info(
        "Iniciando recepção de dados (%s)...",
        "Modo MOCK" if use_mock_data else "Modo SERIAL",
    )

    with open(filename, "a", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        while True:
            try:
                data = data_reader.get_package()
                if data is None:
                    continue
                writer.writerow(data)
                last_row.set(data)

                consecutive_timeouts = 0
                received_rows += 1

                if received_rows % LOG_INTERVAL_ROWS == 0:
                    csvfile.flush()
                    logger.info("Pacotes recebidos: %d", received_rows)

            except TimeoutError as e:
                last_error.set(_exception_to_dict(e))
                consecutive_timeouts += 1

                logger.warning(
                    "Timeout ao aguardar pacote (%d/%d)",
                    consecutive_timeouts,
                    MAX_TIMEOUTS,
                )

                if consecutive_timeouts >= MAX_TIMEOUTS:
                    err_msg = f"Nenhum dado após {MAX_TIMEOUTS} tentativas consecutivas. Encerrando..."
                    logger.error(err_msg)
                    
                    timeout_exc = TimeoutError(err_msg)
                    last_error.set(_exception_to_dict(timeout_exc))
                    
                    last_row.set(None)
                    break

            except Exception as e:
                last_error.set(_exception_to_dict(e))
                logger.exception("Erro inesperado no loop principal do motor.")
                break