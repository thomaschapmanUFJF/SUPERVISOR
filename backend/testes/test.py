import csv
import struct
import serial
import sys
import math
import time as time_module
from app.frame_utils import build_frame, add_noise
from app.schema import PAYLOAD_FORMAT, JSON_SCHEMA
from config.serial import SERIAL_CONFIG
from config.test import TEST_CONFIG

BAUDRATE = SERIAL_CONFIG['baudrate']
WRITE_PORT_PATH = SERIAL_CONFIG['write_port']['path']
CSV_PATH = TEST_CONFIG['csv']['path']
MAX_ACCEL = TEST_CONFIG['max_accel']


def euler_to_quaternion(rotation_x, rotation_y, rotation_z):
    rotation_x = rotation_x * math.pi / 180
    rotation_y = rotation_y * math.pi / 180
    rotation_z = rotation_z * math.pi / 180

    cy = math.cos(rotation_z * 0.5)
    sy = math.sin(rotation_z * 0.5)
    cp = math.cos(rotation_y * 0.5)
    sp = math.sin(rotation_y * 0.5)
    cr = math.cos(rotation_x * 0.5)
    sr = math.sin(rotation_x * 0.5)

    qw = cy * cp * cr + sy * sp * sr
    qx = cy * cp * sr - sy * sp * cr
    qy = cy * sp * cr + sy * cp * sr
    qz = sy * cp * cr - cy * sp * sr
    norm = math.sqrt(qw*qw + qx*qx + qy*qy + qz*qz)
    if norm > 0:
        qw /= norm
        qx /= norm
        qy /= norm
        qz /= norm
        
    return qw, qx, qy, qz

def total_acceleration(accel_x, accel_y, accel_z):
    return (accel_x**2 + accel_y**2 + accel_z**2)**0.5

def vertical_velocity(current_altitude, previous_altitude, current_time, previous_time):
    return (current_altitude - previous_altitude) / (current_time - previous_time)

def average_altitude(gps_altitude, bmp_altitude):
    return (gps_altitude + bmp_altitude) / 2

def generate_packages():
    with open(CSV_PATH, 'r') as file:
        reader = csv.DictReader(file)
        next(reader)
        previous_altitude = 0
        previous_time = 0
        for row in reader:
            time = int(row['Time'])
            status = int(row['Status'])
            bmp_altitude = float(row['BMP Altitude'])
            max_altitude = float(row['Max Altitude'])
            accel_x = float(row['Accel_X'])
            accel_y = float(row['Accel_Y'])
            accel_z = float(row['Accel_Z'])
            rotation_x = float(row['Rotation_X'])
            rotation_y = float(row['Rotation_Y'])
            rotation_z = float(row['Rotation_Z'])
            latitude = float(row['Latitude'])
            longitude = float(row['Longitude'])
            gps_altitude = float(row['GPS Altitude'])
            voltage = float(row['Voltage'])
            
            qw, qx, qy, qz = euler_to_quaternion(rotation_x, rotation_y, rotation_z)
            accel = total_acceleration(accel_x, accel_y, accel_z)
            altitude = average_altitude(gps_altitude, bmp_altitude)
            vel_vertical = vertical_velocity(altitude, previous_altitude, time, previous_time)
            apogeu = max_altitude
            fix = 0
            valores = {
                'time':         time,
                'latitude':     latitude,
                'longitude':    longitude,
                'altitude':     int(altitude * 10),
                'apogeu':       int(apogeu * 10),
                'vel_vertical': int(vel_vertical * 10),
                'qw':           qw,
                'qx':           qx,
                'qy':           qy,
                'qz':           qz,
                'accel_int':    max(min(int(accel * 10), MAX_ACCEL), 0),
                'status':       int(row['Status']),
                'voltage_int':  int(float(row['Voltage']) * 10),
                'fix':          0,
            }            
            payload = struct.pack(PAYLOAD_FORMAT, *[valores.get(k, 0.0 if 'float' in str(JSON_SCHEMA.get(k, '')) else 0) for k in JSON_SCHEMA.keys()])
            
            previous_altitude = altitude
            previous_time = time
            frame = build_frame(payload)
            yield frame
            time_module.sleep(0.05)

def send_package_with_noise():
    for i, package in enumerate(generate_packages()):
        yield add_noise(package)
    print(i)

def to_virtual_port():
    port = None
    try:
        port = serial.Serial(port=WRITE_PORT_PATH, baudrate=BAUDRATE, timeout=1)
        for package in send_package_with_noise():
            if package: port.write(package)
    except KeyboardInterrupt:
        print('INTERROMPENDO O SIMULADOR')
        sys.exit(0)
    finally:
        if port:
            port.close()

if __name__ == '__main__':
    to_virtual_port()