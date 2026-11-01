import os
import sys
import subprocess
from pathlib import Path

root_dir = Path(__file__).resolve().parent
venv_python = root_dir / "backend" / "venv" / "Scripts" / "python.exe"

# If uvicorn is missing or running outside the project's venv, auto-switch to backend\venv
if venv_python.exists() and Path(sys.executable).resolve() != venv_python.resolve():
    try:
        import uvicorn
    except ImportError:
        print(f"[POx Hub] Switching to virtual environment Python: {venv_python}")
        result = subprocess.run([str(venv_python)] + sys.argv)
        sys.exit(result.returncode)

backend_dir = str(root_dir / "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import uvicorn

if __name__ == "__main__":
    print(f"Starting POx Research Hub FastAPI backend on http://127.0.0.1:8000 ...")
    uvicorn.run(
        "app.main:app",
        app_dir=backend_dir,
        host="127.0.0.1",
        port=8000,
        reload=True
    )
