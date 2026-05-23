import csv
from Row import Row
from config.config import CONFIG

HEADER = CONFIG['CSV']['HEADER']
FILENAME = CONFIG['CSV']['FILENAME']

class Escrivao:
    def __init__(self):
        self.header = HEADER
        self.csv_data = []
        self.csv_data.append({key: key for key in self.header})

    def add_row(self, row: Row):
        self.csv_data.append(row.to_dict())

    def save_csv(self):
        with open(FILENAME, 'w', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=self.header)
            writer.writeheader()
            for row in self.csv_data:
                writer.writerow(row)
