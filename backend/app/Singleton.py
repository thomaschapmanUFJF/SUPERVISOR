class Singleton():
    def __init__(self):
        self.data = None
    def set(self, data):
        self.data = data
    def get(self):
        return self.data

global last_row
global last_error

last_row = Singleton()
last_error = Singleton()