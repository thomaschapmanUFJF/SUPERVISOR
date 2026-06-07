import uvicorn
from app.backend.app import app
from motor import motor
import threading

if __name__ == '__main__':
    thread_motor = threading.Thread(target=motor, daemon=True)
    thread_motor.start()
    uvicorn.run(app, host="0.0.0.0", port=8000)