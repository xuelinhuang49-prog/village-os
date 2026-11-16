@echo off
chcp 65001 >nul
echo ============================================
echo   数字乡村平台 - 一键启动
echo ============================================
echo.

cd /d "%~dp0.."

echo 正在启动后端 (后台窗口)...
start "数字乡村-后端" cmd /c "cd /d backend && call mvnw.cmd spring-boot:run"

echo 正在启动前端 (后台窗口)...
start "数字乡村-前端" cmd /c "cd /d frontend && if not exist node_modules npm install && npm run dev"

echo.
echo ============================================
echo   启动中，请稍候...
echo   后端启动约需 15-30 秒
echo   前端启动约需 5-10 秒
echo   浏览器访问: http://localhost:5173
echo ============================================
echo.
echo 关闭本窗口不影响服务运行。
echo 要停止服务，请关闭"数字乡村-后端"和"数字乡村-前端"两个窗口。
echo.
pause
