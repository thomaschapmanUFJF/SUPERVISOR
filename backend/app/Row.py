from dataclasses import make_dataclass
from config.config import CONFIG
from app.schema import json_to_python

JSON_PATH = CONFIG['json']['path']

Row = make_dataclass('Row', list(json_to_python().items()))