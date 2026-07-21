@echo off
set "DIR=%~dp0"
if "%DIR:~-1%"=="\" set "DIR=%DIR:~0,-1%"
set "JAR=%DIR%\.mvn\wrapper\maven-wrapper.jar"
if not exist "%JAR%" (
    echo [ERROR] %JAR% not found
    pause
    exit /b 1
)
set "JAVA_EXE="
if defined JAVA_HOME set "JAVA_EXE=%JAVA_HOME%\bin\java.exe"
if not defined JAVA_EXE for /f "tokens=*" %%i in ('where java 2^>nul') do set "JAVA_EXE=%%i"
if not defined JAVA_EXE set "JAVA_EXE=D:\Program Files\bin\java.exe"
if not exist "%JAVA_EXE%" (
    echo [ERROR] java.exe not found
    pause
    exit /b 1
)
echo JAVA_HOME: %JAVA_HOME%
echo.
"%JAVA_EXE%" -classpath "%JAR%" -Dmaven.multiModuleProjectDirectory="%DIR%" org.apache.maven.wrapper.MavenWrapperMain %*
exit /b %ERRORLEVEL%
