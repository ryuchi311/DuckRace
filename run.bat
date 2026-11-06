@echo off
setlocal enabledelayedexpansion
title Ultimate Duck Race - Local Server

:: Switch directory to this script's folder
cd /d "%~dp0"

echo ===================================================
echo     DUCK RACE - LOCAL SERVER LAUNCHER
echo ===================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in your PATH!
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

:: 2. Set default port (3000) or use existing env var
if "%PORT%"=="" (
    set PORT=3000
)

echo [*] Starting Duck Race local web server on port %PORT%...
echo [*] Server file: server.js
echo.

:: 3. Open browser after short delay in background
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:%PORT%"

:: 4. Start Node.js server
node server.js

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Server stopped with an error code: %errorlevel%
    pause
)
