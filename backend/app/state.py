import json


class StateStore:

    def __init__(self, name=""):
        self.data = None
        self.prefix = f"event: {name}\ndata: "
        self.suffix = "\n\n"

    def set(self, data):
        self.data = data

    def get(self):
        return self.data

    def to_sse_event(self):
        return self.prefix + json.dumps(self.data) + self.suffix


last_row = StateStore("row")
last_error = StateStore("error")
