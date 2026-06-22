class singleton():
    def __init__(self):
        self.singleton_data = None
    def update(self, data):
        self.singleton_data = data
    def get(self):
        return self.singleton_data

global last_row
global last_error

last_row = singleton()
last_error = singleton()