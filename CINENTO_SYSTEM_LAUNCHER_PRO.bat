@echo off
title CINENTO SYSTEM LAUNCHER PRO
color 0E

:: =========================================
:: CINENTO SYSTEM LAUNCHER PRO
:: Version: v1.0
:: Updated: 2026-04-30 [Europe/Istanbul]
:: Status: Website Launcher + Backup + Dashboard
:: =========================================

set PROJECT_DIR=%~dp0
set BACKUP_ROOT=C:\CINENTO_BACKUPS
set PORT=3000
set START_URL=http://localhost:3000/en/login

echo ========================================
echo   CINENTO SYSTEM LAUNCHER PRO
echo ========================================
echo.

echo [1] Closing old Next.js server on port %PORT%...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT%') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo [2] Creating backup...
if not exist "%BACKUP_ROOT%" mkdir "%BACKUP_ROOT%"

set BACKUP_NAME=CINENTO_SITE_BACKUP_%date:~-4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%
set BACKUP_NAME=%BACKUP_NAME: =0%

mkdir "%BACKUP_ROOT%\%BACKUP_NAME%"

xcopy "%PROJECT_DIR%" "%BACKUP_ROOT%\%BACKUP_NAME%\" /E /I /Y /EXCLUDE:%PROJECT_DIR%backup-exclude.txt >nul

echo Backup created:
echo %BACKUP_ROOT%\%BACKUP_NAME%
echo.

echo [3] Starting CINENTO Website...
start "CINENTO Website Server" cmd /k "cd /d %PROJECT_DIR% && npm run dev"

echo [4] Opening browser...
timeout /t 4 >nul
start "" "%START_URL%"

echo.
echo CINENTO SYSTEM STARTED SUCCESSFULLY.
echo.
pause