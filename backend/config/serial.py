write_port_name = 'COM5'
read_port_name = 'COM6'
SERIAL_CONFIG = {
        'baudrate': 9600,
        'write_port':{
            'name': write_port_name,
            'path': rf'\\.\{write_port_name}',
        },
        'read_port':{
            'name': read_port_name,
            'path': rf'\\.\{read_port_name}'        
        },
}