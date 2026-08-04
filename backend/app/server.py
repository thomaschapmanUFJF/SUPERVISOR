import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from .state import last_error, last_row

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_origin_regex=r"https://.*\.app\.github\.dev",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def event_stream_generator(state_store):
    while True:
        current = state_store.get()
        if current:
            yield state_store.to_sse_event()

        yield ": keepalive\n\n"
        await asyncio.sleep(0.0005)


def create_sse_response(state_store) -> StreamingResponse:
    return StreamingResponse(
        event_stream_generator(state_store),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/sse/rows")
async def stream_rows():
    return create_sse_response(last_row)


@app.get("/sse/errors")
async def stream_errors():
    return create_sse_response(last_error)