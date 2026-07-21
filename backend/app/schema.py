import struct
from typing import Any
from config.config import CONFIG
import json

JSON_PATH = CONFIG["json"]["path"]


def open_json():
    with open(JSON_PATH, "r") as f:
        return json.load(f)


SCHEMA_DATA = open_json()

# Mapping string representations from JSON to actual Python type callables
_PYTHON_TYPE_MAP = {
    "int": int,
    "float": float
}

LOGICAL_TYPE_INFO = {
    k: {
        "struct": v["struct"],
        "python": _PYTHON_TYPE_MAP[v["python"]]
    }
    for k, v in SCHEMA_DATA["types"].items()
}

JSON_SCHEMA = SCHEMA_DATA["payload"]


def json_to_python():
    return {k: LOGICAL_TYPE_INFO[v]["python"] for k, v in JSON_SCHEMA.items()}


def json_to_format_string():
    string = "<"
    for tipo in JSON_SCHEMA.values():
        string += LOGICAL_TYPE_INFO[tipo]["struct"]
    return string


HEADER: dict[str, Any] = SCHEMA_DATA["header"]

PAYLOAD_FIELDS = list(JSON_SCHEMA.keys())
PAYLOAD_FORMAT = json_to_format_string()
PAYLOAD_SIZE = struct.calcsize(PAYLOAD_FORMAT)

PAYLOAD: dict[str, Any] = {
    "idx": HEADER["size"],
    "size": PAYLOAD_SIZE,
    "format": PAYLOAD_FORMAT,
    "fields": PAYLOAD_FIELDS,
}

CRC_INFO = SCHEMA_DATA["crc"]

FRAME_SCHEMA: dict[str, Any] = {
    "header": HEADER,
    "payload": PAYLOAD,
    "crc": {
        "idx": HEADER["size"] + PAYLOAD_SIZE,
        "size": CRC_INFO["size"],
        "endianness": CRC_INFO["endianness"]
    },
    "size": HEADER["size"] + PAYLOAD_SIZE + CRC_INFO["size"],
}

SYNC_SIZE = (
    FRAME_SCHEMA["header"]["sync1"]["size"] + FRAME_SCHEMA["header"]["sync2"]["size"]
)
