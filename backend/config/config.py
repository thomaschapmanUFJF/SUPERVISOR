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
    'TEST':
    {
        'CSV_PATH':'data/FLIGHT2.csv',
        'MAX_ACCEL': 255
    },
    'CSV':
    {
        'FILENAME': 'data/FLIGHT3.csv',
    },

}