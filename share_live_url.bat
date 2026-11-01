@echo off
title Share POx Research Hub Live URL (Developed by Sumit Barik)
echo ========================================================
echo   POx Research Hub — Public Shareable Link Generator
echo   Developed by: Sumit Barik (IACS Kolkata)
echo ========================================================
echo.
echo Make sure the website is running first (via start_hub.bat).
echo Creating a secure custom public tunnel...
echo Custom Domain: https://polyoxazoline-research-hub.loca.lt
echo.
echo NOTE: If prompted for Tunnel Password / Host IP, enter:
curl -s https://loca.lt/mytunnelpassword
echo.
echo Starting tunnel...
npx localtunnel --port 5173 --subdomain polyoxazoline-research-hub
pause
