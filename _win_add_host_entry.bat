@echo off
set CURDIR=%~dp0.
TITLE Modifying your HOSTS file
COLOR F0
ECHO.


:: BatchGotAdmin
:-------------------------------------
REM  --> Check for permissions
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params = %*:"="
    echo UAC.ShellExecute "cmd.exe", "/c %~s0 %params%", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    pushd "%CD%"
    CD /D "%~dp0"
:--------------------------------------


:LOOP
ECHO ***********
ECHO DID YOU RUN THIS FILE AS ADMIN MANUALLY? If this terminal window requested admin privelege and you complete these steps, your vhost entry will be malformed and you will need to manually edit it to fix the issue.
echo ***********
SET Choice=
SET /P Choice="Do you want to modify HOSTS file ? (Y/N)"

IF NOT '%Choice%'=='' SET Choice=%Choice:~0,1%

ECHO.
IF /I '%Choice%'=='Y' GOTO ACCEPTED
IF /I '%Choice%'=='N' GOTO REJECTED
ECHO Please type Y (for Yes) or N (for No) to proceed!
ECHO.
GOTO Loop


:REJECTED
ECHO Your HOSTS file was left unchanged>>%systemroot%\Temp\hostFileUpdate.log
ECHO Finished.
GOTO REALEND


:ACCEPTED

echo Enter the name you'd like to access this development script at.
set /p hostname="Enter Your Hostname: "

setlocal enabledelayedexpansion
::Create your list of host domains
set LIST=(%hostname%)
::Set the ip of the domains you set in the list above
set %hostname%=127.0.0.1
:: deletes the parentheses from LIST
set _list=%LIST:~1,-1%
::ECHO %WINDIR%\System32\drivers\etc\hosts > tmp.txt
for  %%G in (%_list%) do (
    set  _name=%%G
    set  _value=!%%G!
    SET NEWLINE=^& echo.
    ECHO Carrying out requested modifications to your HOSTS file
    ::strip out this specific line and store in tmp file
    type %WINDIR%\System32\drivers\etc\hosts | findstr /v !_name! > tmp.txt
    ::re-add the line to it
    ECHO %NEWLINE%^!_value! !_name!>>tmp.txt
    ::overwrite host file
    copy /b/v/y tmp.txt %WINDIR%\System32\drivers\etc\hosts
    del tmp.txt
)
ipconfig /flushdns
ECHO Added hosts line
GOTO END

:END

echo Adding virtual host
@echo off
(
echo:
echo:
echo   ### %hostname% ###
echo   ^<VirtualHost %hostname%:80^>
echo       DocumentRoot "%CURDIR%"
echo       ServerName %hostname%
echo       ^<Directory "%CURDIR%"^>
echo         Options FollowSymLinks
echo         AllowOverride All
echo         Require all granted
echo       ^</Directory^>
echo   ^</VirtualHost^>
) >>C:\xampp\apache\conf\extra\httpd-vhosts.conf

echo Restarting Apache
C:\xampp\apache\bin\httpd.exe -k restart


echo All set, Happy Coding!

:REALEND
pause
EXIT
