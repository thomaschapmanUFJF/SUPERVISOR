import csv
from dataclasses import asdict
import struct
import traceback
from .mensageiro import Mensageiro
from .state import last_row, last_error
from config.config import CONFIG
from .schema import PAYLOAD_FIELDS
from .schema import PAYLOAD_FORMAT
from .row import Row
from .utils import exception_to_dict

FILENAME = CONFIG["csv"]["filename"]


def write_header():
    with open(FILENAME, "w", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=PAYLOAD_FIELDS)
        writer.writeheader()


def update_csv(row):
    with open(FILENAME, "a", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=PAYLOAD_FIELDS)
        writer.writerow(asdict(row))


def decode_row(data):
    decoded = struct.unpack(PAYLOAD_FORMAT, data)
    return Row(*decoded)


def motor(test):
    print("INICIANDO...")
    mensageiro = Mensageiro(test)
    write_header()

    timeout_count = 0
    fails = 0
    received_rows = 0
    MAX_TIMEOUTS = 10
    print("RECEBENDO DADOS:")
    while True:
        try:
            data = mensageiro.get_package()
            if data is None:
                fails += 1
                continue

            row = decode_row(data)
            last_row.set(asdict(row))
            update_csv(row)

            received_rows += 1

            if received_rows % 10 == 0:
                print(f"    {received_rows}")

        except TimeoutError as e:
            last_error.set(exception_to_dict(e))
            timeout_count += 1
            
            if timeout_count >= MAX_TIMEOUTS:
                last_error.set(TimeoutError("Nenhum dado após 10 tentativas. Encerrando..."))
                last_row.set(None)
                break
        except Exception as e:
            last_error.set(exception_to_dict(e))
            traceback.print_exc()
            break
