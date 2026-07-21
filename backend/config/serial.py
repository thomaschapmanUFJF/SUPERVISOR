import json
from pathlib import Path

_SERIAL_PATH = Path(__file__).parent / "serial.json"

with open(_SERIAL_PATH, "r") as f:
    _raw = json.load(f)

SERIAL_CONFIG = {
    "baudrate": _raw["baudrate"],
    "write_port": {
        "name": _raw["write_port"],
        "path": rf'\\.\{_raw["write_port"]}',    
    },
    "read_port": {
        "name": _raw["read_port"],
        "path": rf'\\.\{_raw["read_port"]}',
    },    
}