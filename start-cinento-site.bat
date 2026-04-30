@echo off
title CINENTO Site Launcher PRO
cd /d "%~dp0"

echo ================================
echo CINENTO SITE LAUNCHER PRO
echo ================================

echo Checking port 3000...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Stopping old server PID %%a
    taskkill /PID %%a /F
)

timeout /t 2 >nul

echo Starting CINENTO on port 3000...
start "" http://localhost:3000/en/login

npm run dev
pause