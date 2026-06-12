import csv
import struct
import serial
import sys
import math
import time as time_module
from config.config import CONFIG
from schema import FORMAT

# SERIAL SETTINGS
BAUDRATE = CONFIG['SERIAL']['BAUDRATE']
WRITE_PORT_PATH = CONFIG['SERIAL']['WRITE_PORT']['PATH']

# MISC SETTINGS
MAX_ACCEL = CONFIG['TEST']['MAX_ACCEL']

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

def calcular_accel(accel_x, accel_y, accel_z):
    return (accel_x**2 + accel_y**2 + accel_z**2)**0.5

def calcular_vel_vertical(altitude_atual, altitude_anterior, tempo_atual, tempo_anterior):
    return (altitude_atual - altitude_anterior) / (tempo_atual - tempo_anterior)

def calcular_altitude(gps_altitude, bmp_altitude):
    return (gps_altitude + bmp_altitude) / 2

def through_csv():
    with open('FLIGHT2.csv', 'r') as file:
            reader = csv.DictReader(file)
            next(reader)
            altitude_anterior = 0
            time_anterior = 0
            for row in reader:
                time = int(row['Time'])
                status = int(row['Status'])
                pressure = float(row['Pressure'])
                temperature = float(row['Temperature'])
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
                accel = calcular_accel(accel_x, accel_y, accel_z)
                altitude = calcular_altitude(gps_altitude, bmp_altitude)
                vel_vertical = calcular_vel_vertical(altitude, altitude_anterior, time, time_anterior)
                apogeu = max_altitude
                fix = 0
                accel_int = max(min(int(accel * 10), MAX_ACCEL),0)
                voltage_int = int(voltage * 10)
                info = struct.pack(FORMAT,
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
                altitude_anterior = altitude
                time_anterior = time 
                yield info
if __name__ == '__main__':
    with open('FLIGHT2.csv', 'r') as file:
        try:    
            port = serial.Serial(port = WRITE_PORT_PATH, baudrate = BAUDRATE, timeout = 1)
            reader = csv.DictReader(file)
            next(reader)
            altitude_anterior = 0
            time_anterior = 0
            for row in reader:
                time = int(row['Time'])
                status = int(row['Status'])
                pressure = float(row['Pressure'])
                temperature = float(row['Temperature'])
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
                accel = calcular_accel(accel_x, accel_y, accel_z)
                altitude = calcular_altitude(gps_altitude, bmp_altitude)
                vel_vertical = calcular_vel_vertical(altitude, altitude_anterior, time, time_anterior)
                apogeu = max_altitude
                fix = 0
                accel_int = max(min(int(accel * 10), MAX_ACCEL),0)
                voltage_int = int(voltage * 10)
                info = struct.pack(FORMAT,
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
                port.write(info)
                altitude_anterior = altitude
                time_anterior = time
                print(time)
                time_module.sleep(0.05)
        except KeyboardInterrupt:
            print('INTERROMPENDO O SIMULADOR')
            port.close()
            sys.exit(0)
        finally:
            port.close()
