class Dados:
    def __init__(self):
        self.time = 0
        self.latitude = 0.0
        self.longitude = 0.0
        self.kf_altitude = 0
        self.kf_apogee = 0
        self.kf_vel_vertical = 0
        self.q1 = 0
        self.q2 = 0
        self.q3 = 0
        self.q4 = 0
        self.accel = 0
        self.status = 0
        self.voltage = 0
        self.fix = 0    
    def fill(self,time,latitude,longitude,kf_altitude,kf_apogee,kf_vel_vertical,q1,q2,q3,q4,accel,status,voltage,fix):
        self.time = time
        self.latitude = latitude
        self.longitude = longitude
        self.kf_altitude = kf_altitude
        self.kf_apogee = kf_apogee
        self.kf_vel_vertical = kf_vel_vertical
        self.q1 = q1
        self.q2 = q2
        self.q3 = q3
        self.q4 = q4
        self.accel = accel
        self.status = status
        self.voltage = voltage
        self.fix = fix
        
  