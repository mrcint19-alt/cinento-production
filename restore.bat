@echo off
set source=C:\cinento_backups\backup_latest
set dest=C:\cinento_site

xcopy %source% %dest% /E /I /Y

echo Restore Completed!
pause