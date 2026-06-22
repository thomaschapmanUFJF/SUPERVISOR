import asyncio
import traceback
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import fastapi.middleware.cors as cors
from dataclasses import asdict
from app.Singleton import last_row, last_error

current_row = last_row.get()
current_error = last_error.get()
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
            current_row = last_row.get()
            if current_row is not None:
                await websocket.send_json(asdict(current_row))
            await asyncio.sleep(0.05)
    except WebSocketDisconnect:
        print('DESCONECTADO MANUALMENTE')
    except Exception:
        print(f'ERRO INESPERADO EM APP:')
        traceback.print_exc()