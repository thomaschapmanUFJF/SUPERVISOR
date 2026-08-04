import json
from pathlib import Path

_CONFIG_DIR = Path(__file__).parent
_CONFIG_PATH = _CONFIG_DIR / "config.json"


def _load_config():
    with _CONFIG_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


_RAW = _load_config()

CONFIG = {
    "csv": {
        "filename": _RAW["csv"]["filename"],
        "path": _RAW["csv"]["test_path"],        
    },
    "serial": {
        "baudrate": _RAW["serial"]["baudrate"],
        "write_port": {
            "name": _RAW["serial"]["write_port"]["name"],
            "path": _RAW["serial"]["write_port"]["path"],
        },
        "read_port": {
            "name": _RAW["serial"]["read_port"]["name"],
            "path": _RAW["serial"]["read_port"]["path"],
        },
    },
    "fieldnames": _RAW.get("FIELDNAMES", [])
}


