import asyncio

from fastapi import FastAPI, WebSocket
import fastapi.middleware.cors as cors
from dataclasses import asdict
from last_row import last_row_instance

current_row = last_row_instance.get_row()
app = FastAPI()
app.add_middleware(
    cors.CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    try:
        await websocket.accept() 
        while True:
            current_row = last_row_instance.get_row()
            if current_row is not None:
                await websocket.send_json(asdict(current_row))
            await asyncio.sleep(1)
    except Exception as e:
        print(f'ERROR: {e.getmessage}')
