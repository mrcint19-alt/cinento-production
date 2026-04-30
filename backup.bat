@echo off
set source=C:\cinento_site
set dest=C:\cinento_backups\backup_%date:~10,4%-%date:~4,2%-%date:~7,2%

mkdir %dest%
xcopy %source% %dest% /E /I /Y

echo Backup Completed!
pause