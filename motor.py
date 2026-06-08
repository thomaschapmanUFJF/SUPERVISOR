import csv
from Tradutor import Tradutor
from last_row import last_row_instance
from config.config import CONFIG
from schema import HEADER
from dataclasses import asdict

FILENAME = CONFIG['CSV']['FILENAME']

tradutor = Tradutor()

def update_csv(row):
    with open(FILENAME, 'a', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=HEADER)
        writer.writerow(asdict(row))

def motor():
    print('INICIANDO...')

    tentativas = 0
    rows_recebidas = 0

    while True:
        try:
            row = tradutor.decode_row()
            last_row_instance.update_row(row)
            update_csv(row)
            rows_recebidas += 1
            if rows_recebidas % 10 == 0:
                print(f"ROWS RECEBIDAS: {rows_recebidas}")
        except TimeoutError:
            print('ESPERANDO DADOS DO FOGUETE...')
            tentativas += 1
            if tentativas >= 100:
                print('NENHUM DADO RECEBIDO APÓS 100 TENTATIVAS. ENCERRANDO...')
                break
        except KeyboardInterrupt:
            print('TECLADO APERTADO. ENCERRANDO...')
            break
        except Exception as e:
            print(f'ERRO INESPERADO: {e}')
            break
    