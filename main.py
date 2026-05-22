import serial
import struct
from configs import CONFIGS

porta = serial.Serial(port=r'\\.\COM6', baudrate=CONFIGS.get('BAUDRATE'),timeout=1)
while True:
    data = porta.read(30)
    decoded = struct.unpack('<IffHHhHHHHBBBB',data)
    print(f'tempo atual: {decoded[0]}')