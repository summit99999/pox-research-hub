@echo off
title Share POx Research Hub (No Password / Direct Live Access)
echo ========================================================
echo   POx Research Hub — Instant Public Link (NO PASSWORD)
echo   Developed by: Sumit Barik (IACS Kolkata)
echo ========================================================
echo.
echo Launching Cloudflare Global Edge Tunnel...
echo No password or IP address will be required!
echo.
echo Your public https://*.trycloudflare.com link will appear below:
echo.
.\tools\cloudflared.exe tunnel --url http://localhost:5173
pause
