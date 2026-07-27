@echo off
title The Jobsync - Dev Servers
echo ===================================================
echo   Starting The Jobsync IT Consulting Dev Servers
echo ===================================================

echo [1/2] Starting Backend Server (Port 5000)...
start "Jobsync Backend (Port 5000)" cmd /k "cd backend && echo Starting Node Backend... && node index.js"

echo [2/2] Starting Frontend Server (Vite)...
start "Jobsync Frontend (Vite)" cmd /k "cd frontend && echo Starting React Frontend... && npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo You can now use the website without any email errors.
echo ===================================================
