import logging
import json
import serial
from config.config import CONFIG
from mocks.telemetry_simulator import generate_telemetry

logger = logging.getLogger(__name__)
class DataReader:

    def __init__(self, use_mock_data: bool = False):
        self.use_mock_data = use_mock_data

        if self.use_mock_data:
            self._mock_generator = generate_telemetry()
        else:
            self.port = serial.Serial(
                port=CONFIG["serial"]["read_port"]["path"],
                baudrate=CONFIG["serial"]["baudrate"],
                timeout=1,
            )
            self.port.reset_input_buffer()

    def _read_serial(self) -> dict | None:
        line_bytes = self.port.readline()
        if not line_bytes:
            raise TimeoutError("Timeout ao aguardar dados da porta serial.")

        line_text = line_bytes.decode("utf-8", errors="ignore").strip()

        try:
            return json.loads(line_text)
        except json.JSONDecodeError as e:
            logger.warning(f"Ignorando pacote serial corrompido: {line_text!r} | Erro: {e}")
            return None  

    def get_package(self) -> dict | None:
        if self.use_mock_data:
            item = next(self._mock_generator)
            if isinstance(item, (bytes, str)):
                return json.loads(item)
            return item
        return self._read_serial()