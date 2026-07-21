import uvicorn
from app.server import app
from app.motor import motor
import threading
import sys

test = True if len(sys.argv) > 1 and sys.argv[1] == '1' else False
thread_motor = threading.Thread(target=motor, args=(test,), daemon=True)
thread_motor.start()
uvicorn.run(app, host="0.0.0.0", port=8000)