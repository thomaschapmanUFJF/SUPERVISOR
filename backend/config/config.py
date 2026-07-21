import json
from crc import Crc16
from pathlib import Path

_CONFIG_DIR = Path(__file__).parent
_CONFIG_PATH = _CONFIG_DIR / "config.json"
SCHEMA_PATH = _CONFIG_DIR.parent.parent / "schema.json"

with open(_CONFIG_PATH, "r") as f:
    _raw = json.load(f)

CONFIG = {
    "csv": _raw["csv"],
    "json": {"path": SCHEMA_PATH},
    "crc": {"type": getattr(Crc16, _raw["crc"]["type"]).value},
}