@echo off
title POx Research Hub Launcher (Developed by Sumit Barik)
echo ========================================================
echo   POx Research Hub — Scientific Literature Platform
echo   Developed by: Sumit Barik (IACS Kolkata)
echo ========================================================
echo.
echo Starting FastAPI Backend (http://127.0.0.1:8000)...
start "POx Backend (FastAPI)" cmd /k ".\backend\venv\Scripts\python.exe run_backend.py"

timeout /t 2 /nobreak >nul

echo Starting React + Vite Frontend (http://localhost:5173)...
start "POx Frontend (Vite)" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo Opening browser to http://localhost:5173 ...
start http://localhost:5173

echo.
echo All services running! Leave the terminal windows open while browsing.
echo.
