from dataclasses import dataclass

@dataclass
class Row:
    time: int
    latitude: float
    longitude: float
    altitude: float
    apogeu: float
    vel_vertical: float
    q1: float
    q2: float
    q3: float
    q4: float
    accel_int: int
    status: int
    voltage_int: int
    fix: int