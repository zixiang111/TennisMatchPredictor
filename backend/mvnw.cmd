@REM Maven wrapper script for Windows
@echo off
setlocal enabledelayedexpansion

for /f "tokens=*" %%i in ('cd /d %~dp0 && cd') do set "BASEDIR=%%i"
set MAVEN_PROJECTBASEDIR=%BASEDIR%

if exist "%BASEDIR%\.mvn\wrapper\maven-wrapper.jar" (
    set MAVEN_JAR="%BASEDIR%\.mvn\wrapper\maven-wrapper.jar"
) else (
    echo Error: Maven wrapper JAR not found
    exit /b 1
)

java -cp %MAVEN_JAR% org.codehaus.plexus.classworlds.launcher.Launcher %*
