$projectPath = "D:\Prime Solutions\prime-portal-vercel"

Start-Process powershell.exe `
  -WorkingDirectory $projectPath `
  -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', 'npx vercel dev'

Start-Sleep -Seconds 5

Start-Process "http://localhost:3000"