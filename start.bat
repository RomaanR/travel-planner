@echo off
title KleenPark Dashboard — Local Server

echo ============================================
echo   KleenPark Operations Dashboard
echo   Starting local server on port 8080...
echo ============================================
echo.

cd /d "%~dp0"

REM Try Python 3 first, then Python 2
python --version >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
  echo [OK] Python found. Launching server...
  start "" http://localhost:8080
  python -m http.server 8080
  goto :end
)

py --version >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
  echo [OK] Python (py) found. Launching server...
  start "" http://localhost:8080
  py -m http.server 8080
  goto :end
)

echo [ERROR] Python not found.
echo.
echo Please install Python from https://www.python.org/downloads/
echo Or open index.html directly in Chrome with the --allow-file-access-from-files flag.
echo.
pause

:end
