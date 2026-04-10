$pythonPath = "C:\Users\Dwayne\AppData\Local\Python\pythoncore-3.14-64\python.exe"
$projectPath = "D:\Prime Solutions\prime-portal-vercel"
$serverOutLog = Join-Path $projectPath "portal_server_log.txt"
$serverErrLog = Join-Path $projectPath "portal_server_error_log.txt"

Start-Process -FilePath $pythonPath `
  -ArgumentList @("-m", "http.server", "8080") `
  -WorkingDirectory $projectPath `
  -WindowStyle Hidden `
  -RedirectStandardOutput $serverOutLog `
  -RedirectStandardError $serverErrLog