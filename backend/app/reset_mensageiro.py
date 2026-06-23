import struct
from testes.test import send_package_with_noise
from app.frame_utils import crc_ok, get_payload
from app.schema import PAYLOAD_FORMAT, FRAME_SCHEMA, HEADER_SIZE, SYNC_SIZE

HEADER = FRAME_SCHEMA['header']
CRC = FRAME_SCHEMA['crc']

SYNC1 = HEADER['sync1']
SYNC2 = HEADER['sync2']
TYPE_IDX = HEADER['type']['idx']
LENGTH_IDX = HEADER['length']['idx']
CRC_IDX = CRC['idx']
CRC_SIZE = CRC['size']

SYNC = bytearray([SYNC1['value'], SYNC2['value']])

class Mensageiro:
    def __init__(self, test_mode):
        self.test_mode = test_mode
        self.format = PAYLOAD_FORMAT
        self.size = struct.calcsize(self.format)
        
        if test_mode:
            self.csv_generator = send_package_with_noise()
        else:
            import serial
            from config.serial import SERIAL_CONFIG
            BAUDRATE = SERIAL_CONFIG['BAUDRATE']
            READ_PORT_PATH = SERIAL_CONFIG['READ_PORT']['PATH']
            self.port = serial.Serial(port=READ_PORT_PATH, baudrate=BAUDRATE, timeout=1)

    def read_raw_frame(self):
        if not self.test_mode:
            buffer = bytearray()
            while True:
                byte = self.port.read(1)
                if not byte:
                    continue 
                buffer.extend(byte)
                
                if len(buffer) < SYNC_SIZE:
                    continue

                sync_pos = buffer.find(SYNC)

                if sync_pos == -1:
                    if len(buffer) > SYNC_SIZE * 2:
                        buffer = buffer[-SYNC_SIZE+1:]
                    continue
                if sync_pos > 0:
                    buffer = buffer[sync_pos:]
                
                if len(buffer) < HEADER_SIZE:
                    continue

                length_byte = buffer[LENGTH_IDX]
                frame_size = HEADER_SIZE + length_byte + CRC_SIZE
                if len(buffer) < frame_size:
                    continue
                
                frame_data = buffer[:frame_size]
                buffer = buffer[frame_size:]
                return frame_data
    def get_package(self):
        frame = next(self.csv_generator) if self.test_mode else self.read_raw_frame()
        if not frame or not crc_ok(frame):
            return None
        return get_payload(frame)