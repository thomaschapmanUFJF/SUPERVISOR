import csv
import serial
import sys
import math
import json
import time as time_module
from config.config import CONFIG
import logging

baudrate = CONFIG["serial"]["baudrate"]
write_port_path = CONFIG["serial"]["write_port"]["path"]
csv_path = CONFIG["csv"]["path"]
logger = logging.getLogger(__name__)

MAX_ACCEL = 255


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

def generate_telemetry():
    with open(csv_path, 'r') as file:
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
            values = {
                'time':            time,
                'latitude':        latitude,
                'longitude':       longitude,
                'kf_altitude':     int(altitude * 10),
                'kf_apogee':       int(apogeu * 10),
                'kf_vel_vertical': int(vel_vertical * 10),
                'q1':              qw,
                'q2':              qx,
                'q3':              qy,
                'q4':              qz,
                'accel':           max(min(int(accel * 10), MAX_ACCEL), 0),
                'status':          int(row['Status']),
                'voltage':         int(float(row['Voltage']) * 10),
                'fix':             0,
            }
                    
            previous_altitude = altitude
            previous_time = time

            yield json.dumps(values).encode('utf-8') + b'\n'
            time_module.sleep(0.05)

def to_virtual_port():
    port = None
    try:
        port = serial.Serial(port=write_port_path, baudrate=baudrate, timeout=1)
        for package in generate_telemetry():
            port.write(package)
    except KeyboardInterrupt:
        logger.info('Interrompendo o simulador...')
        sys.exit(0)
    finally:
        if port:
            port.close()

if __name__ == '__main__':
    to_virtual_port()