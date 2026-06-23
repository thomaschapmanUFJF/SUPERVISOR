import csv
from dataclasses import asdict
import struct
import traceback
from backend.app.Mensageiro import Mensageiro
from app.Singleton import last_row
from config.config import CONFIG
from app.schema import HEADER
from app.schema import PAYLOAD_FORMAT
from app.Row import Row

FILENAME = CONFIG['CSV']['FILENAME']

def write_header():
    with open(FILENAME,'w',newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=HEADER)
        writer.writeheader()
def update_csv(row):
    with open(FILENAME, 'a', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=HEADER)
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
            last_row.update(row)
            update_csv(row)
            received_rows += 1

            if received_rows % 10 == 0:
                print(f"    {received_rows}")

        except TimeoutError:
            print('ESPERANDO DADOS DO FOGUETE...')
            tentativas += 1
            if tentativas >= 10:
                print('NENHUM DADO RECEBIDO APÓS 10 TENTATIVAS. ENCERRANDO...')
                last_row.update(None)
                break
        except KeyboardInterrupt:
            print('TECLADO APERTADO. ENCERRANDO...')
            break
        except Exception:
            print(f'ERRO INESPERADO EM MOTOR:')
            traceback.print_exc()
            break       