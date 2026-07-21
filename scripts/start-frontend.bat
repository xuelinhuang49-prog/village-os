@echo off
chcp 65001 >nul
echo ============================================
echo   数字乡村平台 - 前端启动脚本 (Windows)
echo ============================================
echo.

cd /d "%~dp0..\frontend"

echo [1/2] 检查 Node.js 环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] 未找到 Node.js，请安装 Node.js 18+
    pause
    exit /b 1
)
echo         Node.js 环境正常

echo [2/2] 安装依赖并启动...
if not exist "node_modules" (
    echo         首次运行，安装依赖...
    npm install
)
echo.
npm run dev
pause
