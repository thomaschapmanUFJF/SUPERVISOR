import serial
import struct
from testes.testes import through_csv
from config.config import CONFIG
from app.backend.schema import FORMAT

BAUDRATE = CONFIG['SERIAL']['BAUDRATE']
READ_PORT_PATH = CONFIG['SERIAL']['READ_PORT']['PATH']

class Mensageiro:
    def __init__(self, test):
        self.test = test
        self.port = serial.Serial(port=READ_PORT_PATH, baudrate=BAUDRATE, timeout=1)
        self.format = FORMAT
        self.size = struct.calcsize(self.format)
        self.through_csv = through_csv()

    def through_virtual_port(self):
        data = self.port.read(self.size)
        if len(data) != self.size:
            raise TimeoutError(f"TIMEOUT NA PORTA. Esperava {self.size} bytes, recebeu {len(data)}")
        return data
    
    def get_row(self):
        return next(self.through_csv) if self.test is True else self.through_virtual_port()