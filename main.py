from Tradutor import Tradutor
from Escrivao import Escrivao

import sys

tradutor = Tradutor()
escrivao = Escrivao()

def main():
    print('INICIANDO...')
    continua = True
    while continua:
        try:
            row = tradutor.decode_row()
            escrivao.add_row(row)
        except TimeoutError:
            print('ESPERANDO DADOS DO FOGUETE...')
            continua = False
        except KeyboardInterrupt:
            print('TECLADO APERTADO. ENCERRANDO...')
            continua = False
            sys.exit(0)
        except Exception as e:
            print(f'ERRO INESPERADO: {e}')

if __name__ == '__main__':
    main()
    escrivao.save_csv()