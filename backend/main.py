import sys
import threading
import uvicorn
from app.ingest_data import ingest_data
from app.server import app

# '1' enables mock mode; otherwise defaults to physical serial mode
use_mock_data = len(sys.argv) > 1 and sys.argv[1] == "1"

thread_ingestion = threading.Thread(
    target=ingest_data, args=(use_mock_data,), daemon=True
)
thread_ingestion.start()

uvicorn.run(app, host="0.0.0.0", port=8000)