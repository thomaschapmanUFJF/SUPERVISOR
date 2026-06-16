write_port_name = 'COM5'
read_port_name = 'COM6'
SERIAL_CONFIG = {
        'BAUDRATE': 9600,
        'WRITE_PORT':{
            'NAME': write_port_name,
            'PATH': rf'\\.\{write_port_name}',
        },
        'READ_PORT':{
            'NAME': read_port_name,
            'PATH': rf'\\.\{read_port_name}'        
        },
}