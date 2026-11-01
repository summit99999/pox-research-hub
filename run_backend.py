import sys
from pathlib import Path
import uvicorn

if __name__ == "__main__":
    backend_dir = str(Path(__file__).resolve().parent / "backend")
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)
        
    print(f"Starting POx Research Hub FastAPI backend on http://127.0.0.1:8000 ...")
    uvicorn.run(
        "app.main:app",
        app_dir=backend_dir,
        host="127.0.0.1",
        port=8000,
        reload=True
    )
