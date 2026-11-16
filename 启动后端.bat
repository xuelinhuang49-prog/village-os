@echo off
chcp 65001 >nul
title 数字乡村平台 - 后端
cd /d "%~dp0backend"

echo.
echo  ==========================================
echo    数字乡村平台 - 后端启动
echo    地址: http://localhost:8080
echo    需已安装并启动: JDK 25 / PostgreSQL / Redis
echo    停止服务按 Ctrl + C
echo  ==========================================
echo.

mvnw.cmd spring-boot:run
