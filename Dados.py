class Dados:
    def __init__(self):
        self.time = 0
        self.status = 0
        self.pressure = 0.0
        self.temperature = 0.0
        self.bmp_altitude = 0
        self.max_altitude = 0
        self.accel_x = 0
        self.accel_y = 0
        self.accel_z = 0
        self.rotation_x = 0
        self.rotation_y = 0
        self.rotation_z = 0
        self.latitude = 0.0
        self.longitude = 0.0
        self.gps_altitude = 0.0
        self.voltage = 0
        
    def fill_info(self, time, status, pressure, temperature, bmp_altitude, max_altitude, accel_x, accel_y, accel_z, rotation_x, rotation_y, rotation_z, latitude, longitude, gps_altitude, voltage):
        self.time = time
        self.status = status
        self.pressure = pressure
        self.temperature = temperature
        self.bmp_altitude = bmp_altitude
        self.max_altitude = max_altitude
        self.accel_x = accel_x
        self.accel_y = accel_y
        self.accel_z = accel_z
        self.rotation_x = rotation_x
        self.rotation_y = rotation_y
        self.rotation_z = rotation_z
        self.latitude = latitude
        self.longitude = longitude
        self.gps_altitude = gps_altitude
        self.voltage = voltage