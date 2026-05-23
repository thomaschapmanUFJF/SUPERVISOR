import csv
import struct
import serial
import sys
from config.config import CONFIG

# SERIAL SETTINGS
BAUDRATE = CONFIG['SERIAL']['BAUDRATE']
WRITE_PORT_PATH = CONFIG['SERIAL']['WRITE_PORT']['PATH']

# STRUCT SETTINGS
FORMAT = CONFIG['STRUCT']['FORMAT']

# MISC SETTINGS
MAX_ACCEL = CONFIG['TEST']['MAX_ACCEL']

def calcular_accel(accel_x, accel_y, accel_z):
    return (accel_x**2 + accel_y**2 + accel_z**2)**0.5

def calcular_vel_vertical(altitude_atual, altitude_anterior, tempo_atual, tempo_anterior):
    return (altitude_atual - altitude_anterior) / (tempo_atual - tempo_anterior)

def calcular_altitude(gps_altitude, bmp_altitude):
    return (gps_altitude + bmp_altitude) / 2

with open('FLIGHT2.csv', 'r') as file:
    try:    
        port = serial.Serial(port = WRITE_PORT_PATH, baudrate = BAUDRATE, timeout = 1)
        reader = csv.reader(file)
        next(reader)
        altitude_anterior = 0
        time_anterior = 0
        for i,row in enumerate(reader):
            time = int(row[0])
            status = int(row[1])
            pressure = float(row[2])
            temperature = float(row[3])
            bmp_altitude = float(row[4])
            max_altitude = float(row[5])
            accel_x = float(row[6])
            accel_y = float(row[7])
            accel_z = float(row[8])
            rotation_x = float(row[9])
            rotation_y = float(row[10])
            rotation_z = float(row[11])
            latitude = float(row[12])
            longitude = float(row[13])
            gps_altitude = float(row[14])
            voltage = float(row[15])
            
            accel = calcular_accel(accel_x, accel_y, accel_z)
            altitude = calcular_altitude(gps_altitude, bmp_altitude)
            vel_vertical = calcular_vel_vertical(altitude, altitude_anterior, time, time_anterior)
            apogeu = max_altitude
            q1 = q2 = q3 = q4 = 0
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
    except KeyboardInterrupt:
        print('INTERROMPENDO O SIMULADOR')
        port.close()
        sys.exit(0)
    finally:
        port.close()
