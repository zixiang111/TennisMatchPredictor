@rem Gradle wrapper script for Windows
@echo off
setlocal enabledelayedexpansion
for /f "tokens=*" %%i in ('cd /d %~dp0 && cd') do set "BASEDIR=%%i"
call "%BASEDIR%\gradle.bat" %*
endlocal
exit /b %ERRORLEVEL%
