import json
from pathlib import Path

_TEST_PATH = Path(__file__).parent / "test.json"

with open(_TEST_PATH, "r") as f:
    TEST_CONFIG = json.load(f)