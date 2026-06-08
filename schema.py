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

FORMAT = '<' + ''.join(
    tipo
    for _, tipo in PACKET_FIELDS
)
