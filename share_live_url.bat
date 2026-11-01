@echo off
title Share POx Research Hub Live URL (Developed by Sumit Barik)
echo ========================================================
echo   POx Research Hub — Public Shareable Link Generator
echo   Developed by: Sumit Barik (IACS Kolkata)
echo ========================================================
echo.
echo Make sure the website is running first (via start_hub.bat).
echo Creating a secure public tunnel to http://localhost:5173 ...
echo.
echo Your shareable URL will appear below (e.g. https://...loca.lt):
echo You can copy and send that URL to anyone on WhatsApp, Email, or Slack!
echo.
npx localtunnel --port 5173
pause
