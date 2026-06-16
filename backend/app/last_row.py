class last_row():
    def __init__(self):
        self.last_row = None
    def update_row(self, row):
        self.last_row = row
    def get_row(self):
        return self.last_row

global last_row_instance 
last_row_instance = last_row()