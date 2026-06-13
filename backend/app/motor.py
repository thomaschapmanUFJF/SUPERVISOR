import csv
from dataclasses import asdict
import struct

from app.mensageiro import Mensageiro
from app.last_row import last_row_instance
from config.config import CONFIG
from app.schema import HEADER
from app.schema import FORMAT
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
    decoded = struct.unpack(FORMAT, data)        
    return Row(*decoded)

def motor(test):
    print('INICIANDO...')
    mensageiro = Mensageiro(test)
    tentativas = 0
    rows_recebidas = 0
    write_header()
    while True:
        try:
            data = mensageiro.get_row()
            row = decode_row(data)
            last_row_instance.update_row(row)
            update_csv(row)
            rows_recebidas += 1

            if rows_recebidas % 10 == 0:
                print(f"ROWS RECEBIDAS: {rows_recebidas}")

        except TimeoutError:
            print('ESPERANDO DADOS DO FOGUETE...')
            tentativas += 1
            if tentativas >= 10:
                print('NENHUM DADO RECEBIDO APÓS 10 TENTATIVAS. ENCERRANDO...')
                last_row_instance.update_row(None)
                break
        except KeyboardInterrupt:
            print('TECLADO APERTADO. ENCERRANDO...')
            break
        except Exception as e:
            print(f'ERRO INESPERADO: {e}')
            break