import struct
from config.config import CONFIG
import json

JSON_PATH = CONFIG['json']['path']

def open_json():
    with open(JSON_PATH, 'r') as f:
        return json.load(f)
        
JSON_SCHEMA = open_json()

LOGICAL_TYPE_INFO = {
    'uint8':   {'struct': 'B', 'python': int},
    'int8':    {'struct': 'b', 'python': int},
    'uint16':  {'struct': 'H', 'python': int},
    'int16':   {'struct': 'h', 'python': int},
    'uint32':  {'struct': 'I', 'python': int},
    'int32':   {'struct': 'i', 'python': int},
    'float32': {'struct': 'f', 'python': float},
}

def json_to_python():
    return {k:LOGICAL_TYPE_INFO[v]['python'] for k,v in JSON_SCHEMA.items()}

def json_to_format_string():
    string = '<'
    for tipo in open_json().values():
        string += LOGICAL_TYPE_INFO[tipo]['struct']
    return string

HEADER = {
    'sync1': {'idx': 0, 'size': 1, 'value': 0xAA},
    'sync2': {'idx': 1, 'size': 1, 'value': 0xFF},
    'type': {'idx': 2, 'size': 1},
    'length': {'idx': 3, 'size': 1},    
}

HEADER['size'] = sum(item['size'] for item in HEADER.values())

PAYLOAD_FIELDS = JSON_SCHEMA.keys()
PAYLOAD_FORMAT = json_to_format_string()
PAYLOAD_SIZE = struct.calcsize(PAYLOAD_FORMAT)

PAYLOAD = {
    'idx': 4,
    'size': PAYLOAD_SIZE,
    'format': PAYLOAD_FORMAT,
    'fields': PAYLOAD_FIELDS
}

FRAME_SCHEMA = {
    'header': HEADER,
    'payload': PAYLOAD,
    'crc': {
        'idx': HEADER['size'] + PAYLOAD_SIZE,
        'size': 2,
        'endianness': 'little'
    }
}
SYNC_SIZE = FRAME_SCHEMA['header']['sync1']['size'] + FRAME_SCHEMA['header']['sync2']['size']
FRAME_SCHEMA['size'] = FRAME_SCHEMA['header']['size'] + FRAME_SCHEMA['payload']['size'] + 2  