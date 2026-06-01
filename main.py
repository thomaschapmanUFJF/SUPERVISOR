import uvicorn

from Tradutor import Tradutor
from Escrivao import Escrivao
from app.backend.app import app
from motor import motor
import threading

tradutor = Tradutor()
escrivao = Escrivao()

if __name__ == '__main__':
    thread_motor = threading.Thread(target=motor, daemon=True)
    thread_motor.start()
    uvicorn.run(app, host="0.0.0.0", port=8000)