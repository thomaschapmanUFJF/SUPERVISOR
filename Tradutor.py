import serial
import struct
from Row import Row
from config.config import CONFIG

BAUDRATE = CONFIG['SERIAL']['BAUDRATE']
READ_PORT_PATH = CONFIG['SERIAL']['READ_PORT']['PATH']
FORMAT = CONFIG['STRUCT']['FORMAT']
PORT = serial.Serial(port=READ_PORT_PATH, baudrate=BAUDRATE, timeout=1)

class Tradutor:
    def __init__(self, port=PORT, format=FORMAT):
        self.port = port
        self.format = format
        self.size = struct.calcsize(self.format)

    def decode_row(self):
        data = self.port.read(self.size)
        if len(data) != self.size:
            raise TimeoutError(f"TIME OUT NA PORTA. Esperava {self.size} bytes, recebeu {len(data)}")
        decoded = struct.unpack(self.format, data)        
        row = Row(decoded)
        return row
    