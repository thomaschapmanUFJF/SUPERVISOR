import asyncio
import traceback
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
import fastapi.middleware.cors as cors
from dataclasses import asdict
from app.Singleton import last_row, last_error

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
            if current_row:
                await websocket.send_json(asdict(current_row))
            await asyncio.sleep(0.05)
    except WebSocketDisconnect:
        last_error.update({
            "message": "DESCONECTADO MANUALMENTE",
            "code": "WS_DISCONNECT"
        })
        print('DESCONECTADO MANUALMENTE')
    except Exception as e:
        last_error.update({
            "message": f"ERRO INESPERADO EM APP: {str(e)}",
            "code": "UNEXPECTED_ERROR"
        })
        traceback.print_exc()

async def error_generator():
    while True:
        current_error = last_error.get()
        if current_error:
            yield f"event: error\ndata: {json.dumps(current_error)}\n\n"
        
        yield ": keepalive\n\n"
        await asyncio.sleep(0.05)

@app.get("/sse/errors")  
async def get_error():
    return StreamingResponse(
        error_generator(),
        media_type='text/event-stream',
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )