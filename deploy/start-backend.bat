@echo off
setlocal
chcp 65001 >nul
title 数字乡村平台 · 后端服务

rem 定位到 backend 目录（本脚本位于 deploy/ 下）
cd /d "%~dp0..\backend"

set JAR=target\village-os-backend-1.0.0-SNAPSHOT.jar
if not exist "%JAR%" (
  echo [错误] 找不到 %JAR%
  echo 请先在 backend 目录执行：mvnw.cmd clean package -Dmaven.test.skip=true
  pause
  exit /b 1
)

echo ============================================
echo   数字乡村平台 · 后端服务
echo   端口：8080
echo   数据文件：backend\data\village_os.mv.db
echo   按 Ctrl+C 停止
echo ============================================
echo.
java -jar "%JAR%"
endlocal
