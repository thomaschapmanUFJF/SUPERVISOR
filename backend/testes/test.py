import csv
import struct
import serial
import sys
import math
import time as time_module
from app.frame_utils import build_frame, add_noise
from app.schema import PAYLOAD_FORMAT
from config.serial import SERIAL_CONFIG
from config.test import TEST_CONFIG

BAUDRATE = SERIAL_CONFIG['baudrate']
WRITE_PORT_PATH = SERIAL_CONFIG['write_port']['path']
CSV_PATH = TEST_CONFIG['csv']['path']
MAX_ACCEL = TEST_CONFIG['max_accel']


def euler_to_quaternion(rotation_x, rotation_y, rotation_z):
    rotation_x = rotation_x * 3.141592653589793 / 180
    rotation_y = rotation_y * 3.141592653589793 / 180
    rotation_z = rotation_z * 3.141592653589793 / 180

    cy = math.cos(rotation_z * 0.5)
    sy = math.sin(rotation_z * 0.5)
    cp = math.cos(rotation_y * 0.5)
    sp = math.sin(rotation_y * 0.5)
    cr = math.cos(rotation_x * 0.5)
    sr = math.sin(rotation_x * 0.5)

    q1 = cy * cp * cr + sy * sp * sr
    q2 = cy * cp * sr - sy * sp * cr
    q3 = cy * sp * cr + sy * cp * sr
    q4 = sy * cp * cr - cy * sp * sr
    norm = math.sqrt(q1*q1 + q2*q2 + q3*q3 + q4*q4)
    if norm > 0:
        q1 /= norm
        q2 /= norm
        q3 /= norm
        q4 /= norm
    return q1, q2, q3, q4

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
            
            q1, q2, q3, q4 = euler_to_quaternion(rotation_x, rotation_y, rotation_z)
            accel = total_acceleration(accel_x, accel_y, accel_z)
            altitude = average_altitude(gps_altitude, bmp_altitude)
            vel_vertical = vertical_velocity(altitude, previous_altitude, time, previous_time)
            apogeu = max_altitude
            fix = 0
            accel_int = max(min(int(accel * 10), MAX_ACCEL), 0)
            voltage_int = int(voltage * 10)
            
            payload = struct.pack(PAYLOAD_FORMAT,
                                time,
                                latitude,
                                longitude,
                                int(altitude * 10),
                                int(apogeu * 10),
                                int(vel_vertical * 10),
                                q1,
                                q2,
                                q3,
                                q4,
                                accel_int,
                                status,
                                voltage_int,
                                fix)
            
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