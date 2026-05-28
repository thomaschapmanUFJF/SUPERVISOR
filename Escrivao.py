import csv
from Row import Row
from Sheet import Sheet
from config.config import CONFIG

HEADER = CONFIG['CSV']['HEADER']
FILENAME = CONFIG['CSV']['FILENAME']

class Escrivao:
    def __init__(self, sheet=Sheet()):
        self.header = HEADER
        self.csv_data = sheet

    def get_csv_data(self):
        return self.csv_data

    def add_row(self, row: Row):
        self.csv_data.add_row(row.to_dict())

    def save_csv(self):
        with open(FILENAME, 'w', newline='') as csvfile:
            writer = csv.write(csvfile, fieldnames=self.header)
            writer.writeheader()
            for row in self.csv_data:
                for collumn in row:
                    writer.writerow(collumn)
