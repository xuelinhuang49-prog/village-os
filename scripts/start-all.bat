@echo off
chcp 65001 >nul
echo ============================================
echo   数字乡村平台 - 一键启动 (Windows)
echo ============================================
echo.
echo 启动顺序:
echo   1. 确保 PostgreSQL 已启动
echo   2. 确保 Redis 已启动
echo   3. 启动后端 (端口 8080)
echo   4. 启动前端 (端口 5173)
echo ============================================
echo.

echo [提示] 请分别运行以下命令:
echo.
echo   启动后端:  start backend\mvnw.cmd spring-boot:run
echo   启动前端:  cd frontend ^&^& npm run dev
echo.
echo 或者分两个终端分别执行:
echo   Terminal 1: scripts\start-backend.bat
echo   Terminal 2: scripts\start-frontend.bat
echo.
pause
