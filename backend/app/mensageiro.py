import struct
from testes.testes import through_csv
from app.schema import FORMAT

class Mensageiro:
    def __init__(self, test):
        self.test = test
        self.format = FORMAT
        self.size = struct.calcsize(self.format)
        self.through_csv = through_csv()
        if (test):
            import serial
            from config.serial import SERIAL_CONFIG
            BAUDRATE = SERIAL_CONFIG['BAUDRATE']
            READ_PORT_PATH = SERIAL_CONFIG['READ_PORT']['PATH']
            self.port = serial.Serial(port=READ_PORT_PATH, baudrate=BAUDRATE, timeout=1)

    def through_virtual_port(self):
        if (self.test):
            data = self.port.read(self.size)
            if len(data) != self.size:
                raise TimeoutError(f"TIMEOUT NA PORTA. Esperava {self.size} bytes, recebeu {len(data)}")
            return data
    
    def get_row(self):
        return next(self.through_csv) if self.test else self.through_virtual_port()