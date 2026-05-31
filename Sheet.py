from config.config import CONFIG

HEADER = CONFIG['CSV']['HEADER']

class Sheet():
    def __init__(self):
        self.sheet = []
    def __iter__(self):
        return iter(self.sheet)
    def __getitem__(self, index):
        return self.sheet[index]
    def add_row(self, row):
        self.sheet.append(row)
    def add_row_dict(self, row_dict):
        self.sheet.append(row_dict)
    def __print__(self):
        return f"Sheet(sheet={self.sheet})"