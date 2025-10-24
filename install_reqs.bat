@echo off
title dcd.gg/spamito-bot
color 0a
echo ====================================================
echo              Installing Requeriments
echo ====================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado. Por favor instala Node.js antes de continuar.
    echo Puedes descargarlo desde: https://nodejs.org/
    pause
    exit /b
)

echo Installing Requeriments
npm install mineflayer chalk@4 discord-rpc readline --save

echo.
echo Requeriments Installeds
echo Now open start.bat

pause
