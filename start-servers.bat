@echo off
title The Jobsync - Dev Servers
echo ===================================================
echo   Starting The Jobsync IT Consulting Dev Servers
echo ===================================================

echo [1/3] Clearing previous server instances...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING 2^>nul') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5174 ^| findstr LISTENING 2^>nul') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING 2^>nul') do taskkill /F /PID %%a >nul 2>&1

echo [2/3] Starting Backend Server (Port 5000)...
start "Jobsync Backend (Port 5000)" cmd /k "cd backend && echo Starting Node Backend... && node index.js"

echo [3/3] Starting Frontend Server (Vite Port 5173)...
start "Jobsync Frontend (Vite)" cmd /k "cd frontend && echo Starting React Frontend... && npm run dev"

echo.
echo ===================================================
echo Both servers launched! 
echo Open your browser and go to: http://localhost:5173
echo ===================================================
