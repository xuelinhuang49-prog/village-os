@echo off
chcp 65001 >nul
echo ============================================
echo   数字乡村平台 - 后端启动脚本 (Windows)
echo ============================================
echo.

cd /d "%~dp0..\backend"

echo [1/2] 检查 Java 环境...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] 未找到 Java，请安装 JDK 25+
    pause
    exit /b 1
)
echo         Java 环境正常

echo [2/2] 启动 Spring Boot 后端...
echo.
call mvnw.cmd spring-boot:run
pause
