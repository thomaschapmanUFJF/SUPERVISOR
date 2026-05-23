write_port_name = 'COM5'
read_port_name = 'COM6'

CONFIG = {
    'SERIAL': 
    {
        'BAUDRATE': 9600,

        'WRITE_PORT':{
            'NAME': write_port_name,
            'PATH': rf'\\.\{write_port_name}',
        },
        'READ_PORT':{
            'NAME': read_port_name,
            'PATH': rf'\\.\{read_port_name}'        
        },
    },
    'STRUCT':
    {
        'FORMAT': '<IffHHhHHHHBBBB'
    },

    'TEST':
    {
        'CSV_PATH':'FLIGHT2.csv',
        'MAX_ACCEL': 255
    },

    'CSV':
    {
        'FILENAME': 'FLIGHT3.csv',
        'HEADER': [     "time",
                    "latitude",
                    "longitude",
                    "altitude",
                    "apogeu",
                    "vel_vertical",
                    "q1",
                    "q2",
                    "q3",
                    "q4",
                    "accel_int",
                    "status",
                    "voltage_int",
                    "fix"]
    },

}
