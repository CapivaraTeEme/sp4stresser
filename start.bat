@echo off
title $P4 - MC Stresser
color 0e
echo Starting...
timeout /t 1 >nul

start "Minecraft Bot Joiner" cmd /k "node main.js"
exit