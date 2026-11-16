@echo off
chcp 65001 >nul
title 数字乡村平台 - 前端
cd /d "%~dp0frontend"

echo.
echo  ==========================================
echo    数字乡村平台 - 前端启动
echo    地址: http://localhost:5173
echo    会自动打开浏览器；停止服务按 Ctrl + C
echo  ==========================================
echo.

npm run dev -- --open
