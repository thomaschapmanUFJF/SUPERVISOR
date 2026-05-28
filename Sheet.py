from config.config import CONFIG

HEADER = CONFIG['CSV']['HEADER']

class Sheet():
    def __init__(self):
        self.sheet = []
        self.sheet.append(HEADER)
    def __iter__(self):
        return iter(self.sheet)
    def __getitem__(self, index):
        return self.sheet[index]
    def add_row(self, row):
        self.sheet.append(row)