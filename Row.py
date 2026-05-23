class Row:
    def __init__(self, data):
        self.time = int(data[0])
        self.latitude = float(data[1])
        self.longitude = float(data[2])
        self.altitude = float(data[3]) / 10  
        self.apogeu = float(data[4]) / 10
        self.vel_vertical = float(data[5]) / 10
        self.q1 = int(data[6])
        self.q2 = int(data[7])
        self.q3 = int(data[8])
        self.q4 = int(data[9])
        self.accel_int = int(data[10])
        self.status = int(data[11])
        self.voltage_int = int(data[12])
        self.fix = int(data[13])
    
    def to_list(self):
        return [
            self.time,
            self.latitude,
            self.longitude,
            self.altitude,
            self.apogeu,
            self.vel_vertical,
            self.q1, self.q2, self.q3, self.q4,
            self.accel_int,
            self.status,
            self.voltage_int,
            self.fix
        ]
    
    def to_dict(self):
        return {
            'time': self.time,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'altitude': self.altitude,
            'apogeu': self.apogeu,
            'vel_vertical': self.vel_vertical,
            'q1': self.q1,
            'q2': self.q2,
            'q3': self.q3,
            'q4': self.q4,
            'accel_int': self.accel_int,
            'status': self.status,
            'voltage_int': self.voltage_int,
            'fix': self.fix
        }