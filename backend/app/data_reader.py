import json
import serial
from config.config import CONFIG
from mocks.telemetry_simulator import generate_telemetry


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

    def _read_serial(self) -> dict:
        line_bytes = self.port.readline()
        if not line_bytes:
            raise TimeoutError("Timeout ao aguardar dados da porta serial.")

        line_text = line_bytes.decode("utf-8").strip()
        return json.loads(line_text)

    def get_package(self) -> dict:
        if self.use_mock_data:
            return next(self._mock_generator)
        return self._read_serial()