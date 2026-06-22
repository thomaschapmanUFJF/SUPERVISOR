from crc import Calculator, Crc16
import struct
import random
from app.schema import PAYLOAD_FORMAT, FRAME_SCHEMA, HEADER_SIZE
from config.test import TEST_CONFIG
from config.config import CONFIG

CRC_TYPE = CONFIG['CRC']['TYPE']

PROBS = TEST_CONFIG['PROBS']
PROB_SWAP = PROBS['SWAP']
PROB_ADD_RAND = PROBS['ADD_RAND']
PROB_CUT_IN_HALF = PROBS['CUT_IN_HALF']
PROB_DROP = PROBS['DROP']

SYNC_BYTE_1 = FRAME_SCHEMA['header']['sync1']['value']
SYNC_BYTE_2 = FRAME_SCHEMA['header']['sync2']['value']
CRC_SIZE = FRAME_SCHEMA['crc']['size']
CRC_ENDIANNESS = FRAME_SCHEMA['crc']['endianness']
TYPE_IDX = FRAME_SCHEMA['header']['type']['idx']
LENGTH_IDX = FRAME_SCHEMA['header']['length']['idx']
CRC_IDX = FRAME_SCHEMA['crc']['idx']


def calculate_crc(type, length, payload):
    calculator = Calculator(CRC_TYPE)
    data = bytes([type]) + bytes([length]) + payload
    checksum = calculator.checksum(data)
    return checksum

def calculate_crc_from_frame(frame):
    type_byte = frame[TYPE_IDX]
    length_byte = frame[LENGTH_IDX]
    payload = frame[HEADER_SIZE : HEADER_SIZE + length_byte]
    
    calculator = Calculator(CRC_TYPE)
    data = bytes([type_byte]) + bytes([length_byte]) + payload
    crc_value = calculator.checksum(data)
    return crc_value

def crc_ok(frame):
    crc_value = calculate_crc_from_frame(frame)
    expected_crc = crc_value.to_bytes(CRC_SIZE, CRC_ENDIANNESS)
    package_crc = frame[CRC_IDX : CRC_IDX + CRC_SIZE]
    return expected_crc == package_crc

def build_frame(payload, type=0x01):
    length = len(payload)
    crc_value = calculate_crc(type, length, payload)
    crc_bytes = crc_value.to_bytes(CRC_SIZE, CRC_ENDIANNESS)
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
    if random.random() <= PROB_DROP:
        print('DROP!')
        return None
    
    novo_frame = frame[:]
    if random.random() <= PROB_SWAP:
        idx = random.randrange(len(novo_frame))
        novo_frame[idx] = random.randint(0, 255)
        print('SWAP!')
    
    if random.random() <= PROB_ADD_RAND:
        novo_frame.insert(0, random.randint(0, 255))
        print('RANDOM!')
    
    if random.random() <= PROB_CUT_IN_HALF:
        meio = len(novo_frame) // 2
        novo_frame = novo_frame[:meio]
        print('CUT IN HALF!')
    
    return novo_frame

def get_payload(frame):
    length_byte = frame[LENGTH_IDX]
    return frame[HEADER_SIZE : HEADER_SIZE + length_byte]

if __name__ == "__main__":
    from testes.test import generate_packages
    teste = next(generate_packages())
    payload = get_payload(teste)
    print(len(payload))
    print(struct.unpack(PAYLOAD_FORMAT,payload))
    
