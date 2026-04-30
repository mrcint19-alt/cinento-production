Set WshShell = CreateObject("WScript.Shell")

projectPath = "C:\Users\Notebook\Desktop\CIONENTO WEB\cinento_site"

WshShell.CurrentDirectory = projectPath

WshShell.Run "cmd /c start-cinento-site.bat", 0, False

WScript.Sleep 5000

WshShell.Run "http://localhost:3000/en/login", 1, False