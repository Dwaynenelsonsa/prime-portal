$projectPath = "D:\Prime Solutions\prime-portal-vercel"
$mcpPath = "D:\Prime Solutions\prime-portal-vercel\mcp-server"

Start-Process powershell.exe `
  -WorkingDirectory $projectPath `
  -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', 'npx vercel dev'

Start-Sleep -Seconds 4

Start-Process powershell.exe `
  -WorkingDirectory $mcpPath `
  -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', 'node .\server.js'

Start-Sleep -Seconds 3

Start-Process powershell.exe `
  -WorkingDirectory $mcpPath `
  -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', 'cloudflared tunnel --url http://127.0.0.1:3002'

Start-Sleep -Seconds 5

Start-Process "http://localhost:3000"