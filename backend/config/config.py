from crc import Crc16
from pathlib import Path

SCHEMA_PATH = Path(__file__).parent.parent.parent / 'schema.json'
CONFIG = {
    'csv':
    {
        'filename': 'data/FLIGHT3.csv',
    },
    'json':
    {
        'path': SCHEMA_PATH
    },
    'crc':
    {
        'type': Crc16.IBM
    }
}