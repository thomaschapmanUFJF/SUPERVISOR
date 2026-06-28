from crc import Calculator
import struct
import random
from app.schema import PAYLOAD_FORMAT, FRAME_SCHEMA
from config.test import TEST_CONFIG
from config.config import CONFIG

CRC_TYPE = CONFIG['crc']['type']
CRC = FRAME_SCHEMA['crc']

PROBS = TEST_CONFIG['probs']
SWAP = PROBS['swap']
ADD_RAND = PROBS['add_rand']
CUT_IN_HALF = PROBS['cut_in_half']
DROP = PROBS['drop']

HEADER = FRAME_SCHEMA['header']
SYNC_BYTE_1 = HEADER['sync1']['value']
SYNC_BYTE_2 = HEADER['sync2']['value']

def calculate_crc(type, length, payload):
    calculator = Calculator(CRC_TYPE)
    data = bytes([type]) + bytes([length]) + payload
    checksum = calculator.checksum(data)
    return checksum

def calculate_crc_from_frame(frame):
    type_byte = frame[HEADER['type']['idx']]
    length_byte = frame[HEADER['length']['idx']]
    payload = frame[HEADER['size'] : HEADER['size'] + length_byte]
    calculator = Calculator(CRC_TYPE)
    data = bytes([type_byte]) + bytes([length_byte]) + payload
    crc_value = calculator.checksum(data)
    return crc_value

def crc_ok(frame):
    crc_value = calculate_crc_from_frame(frame)
    expected_crc = crc_value.to_bytes(CRC['size'], CRC['endianness'])
    package_crc = frame[CRC['idx'] : CRC['idx'] + CRC['size']]
    return expected_crc == package_crc

def build_frame(payload, type=0x01):
    length = len(payload)
    crc_value = calculate_crc(type, length, payload)
    crc_bytes = crc_value.to_bytes(CRC['size'], CRC['endianness'])
    return bytearray([
        SYNC_BYTE_1,
        SYNC_BYTE_2,
        type,
        length,
        *payload,
        crc_bytes[0],
        crc_bytes[1]
    ])

def add_noise(frame):
    if random.random() <= DROP:
        print('DROP!')
        return None
    
    novo_frame = frame[:]
    if random.random() <= SWAP:
        idx = random.randrange(len(novo_frame))
        novo_frame[idx] = random.randint(0, 255)
        print('SWAP!')
    
    if random.random() <= ADD_RAND:
        novo_frame.insert(0, random.randint(0, 255))
        print('RANDOM!')
    
    if random.random() <= CUT_IN_HALF:
        meio = len(novo_frame) // 2
        novo_frame = novo_frame[:meio]
        print('CUT IN HALF!')
    
    return novo_frame

def get_payload(frame):
    length_byte = frame[HEADER['length']['idx']]
    return frame[HEADER['size'] : HEADER['size'] + length_byte]

if __name__ == "__main__":
    from testes.test import generate_packages
    teste = next(generate_packages())
    payload = get_payload(teste)
    print(len(payload))
    print(struct.unpack(PAYLOAD_FORMAT,payload))
    
