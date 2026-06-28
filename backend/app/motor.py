import csv
from dataclasses import asdict
import struct
import traceback
from app.Mensageiro import Mensageiro
from app.Singleton import last_row, last_error
from config.config import CONFIG
from app.schema import PAYLOAD_FIELDS
from app.schema import PAYLOAD_FORMAT
from app.Row import Row
from app.Error import Error

FILENAME = CONFIG['csv']['filename']

def write_header():
    with open(FILENAME,'w',newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=PAYLOAD_FIELDS)
        writer.writeheader()
def update_csv(row):
    with open(FILENAME, 'a', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=PAYLOAD_FIELDS)
        writer.writerow(asdict(row))
def decode_row(data):
    decoded = struct.unpack(PAYLOAD_FORMAT, data)        
    return Row(*decoded)

def motor(test):
    print('INICIANDO...')
    mensageiro = Mensageiro(test)
    tentativas = 0
    fails = 0
    received_rows = 0
    write_header()
    print("RECEIVED ROWS:")
    while True:
        try:
            data = mensageiro.get_package()
            if (data is None):
                fails += 1
                continue
            row = decode_row(data)
            last_row.set(row)
            update_csv(row)
            received_rows += 1

            if received_rows % 10 == 0:
                print(f"    {received_rows}")

        except TimeoutError as e:
            last_error.set(e('ESPERANDO DADOS DO FOGUETE'))
            tentativas += 1
            if tentativas >= 10:
                last_error.set(e('NENHUM DADO RECEBIDO APÓS 10 TENTATIVAS. ENCERRANDO...'))
                last_row.set(None)
                break
        except KeyboardInterrupt as e:
            last_error.set(e('TECLADO APERTADO. ENCERRANDO...'))
            break
        except Exception as e:
            last_error.set(e('ERRO INESPERADO EM MOTOR'))
            traceback.print_exc()
            break       