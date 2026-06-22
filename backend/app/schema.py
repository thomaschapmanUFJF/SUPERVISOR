import struct

PACKET_FIELDS = [
            ('time', 'I'),
            ('latitude', 'f'),
            ('longitude', 'f'),
            ('altitude', 'H'),
            ('apogeu', 'H'),
            ('vel_vertical', 'h'),
            ('q1', 'f'),
            ('q2', 'f'),
            ('q3', 'f'),
            ('q4', 'f'),
            ('accel_int', 'B'),
            ('status', 'B'),
            ('voltage_int', 'B'),
            ('fix', 'B')
        ]

HEADER = [field[0] for field in PACKET_FIELDS]

HEADER_SIZE = 4

PAYLOAD_FORMAT = '<' + ''.join(tipo for _, tipo in PACKET_FIELDS)
PAYLOAD_SIZE = struct.calcsize(PAYLOAD_FORMAT)

FRAME_SCHEMA = {
    'header': {
        'sync1': {'idx': 0, 'size': 1, 'value': 0xAA},
        'sync2': {'idx': 1, 'size': 1, 'value': 0xFF},
        'type': {'idx': 2, 'size': 1},
        'length': {'idx': 3, 'size': 1},
    },
    'payload': {
        'idx': 4,
        'size': PAYLOAD_SIZE,
        'format': PAYLOAD_FORMAT,
        'fields': PACKET_FIELDS
    },
    'crc': {
        'idx': HEADER_SIZE + PAYLOAD_SIZE,
        'size': 2,
        'endianness': 'little'
    }
}
SYNC_SIZE = FRAME_SCHEMA['header']['sync1']['size'] + FRAME_SCHEMA['header']['sync2']['size']
FRAME_SIZE = HEADER_SIZE + PAYLOAD_SIZE + 2  