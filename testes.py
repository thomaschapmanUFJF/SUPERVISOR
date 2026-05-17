from Dados import Dados
import csv
import struct

with open('FLIGHT2.csv', 'r') as file:
    reader = csv.reader(file)
    next(reader)
    data = list(reader)
    for row in data:
        time = int(row[0])
        longitude = float(row[12])
        latitude = float(row[13])
        info = struct.pack('<Iff', time, longitude, latitude)
        print(info)

            