param(
  [switch]$Reload
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontend = Join-Path $root 'frontend'
$backend = Join-Path $root 'backend'

function Test-PortOpen {
  param([string]$HostName = '127.0.0.1', [int]$Port, [int]$TimeoutMs = 800)
  try {
    $client = New-Object System.Net.Sockets.TcpClient
    $iar = $client.BeginConnect($HostName, $Port, $null, $null)
    $ok = $iar.AsyncWaitHandle.WaitOne($TimeoutMs, $false)
    if (-not $ok) { $client.Close(); return $false }
    $client.EndConnect($iar) | Out-Null
    $client.Close()
    return $true
  } catch {
    return $false
  }
}

function Get-EnvValueFromFiles {
  param([string]$Key, [string[]]$Files)
  foreach ($file in $Files) {
    if (-not (Test-Path $file)) { continue }
    foreach ($line in (Get-Content $file)) {
      if ($line -match '^\s*#') { continue }
      if ($line -match '^\s*$') { continue }
      if ($line -match "^\s*$Key\s*=\s*(.*)\s*$") {
        $value = $Matches[1].Trim()
        if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
          $value = $value.Substring(1, $value.Length - 2)
        }
        return $value
      }
    }
  }
  return $null
}

if (-not (Test-Path (Join-Path $frontend 'package.json'))) {
  throw "No se encontro frontend/package.json en $frontend"
}
if (-not (Test-Path (Join-Path $backend 'app\main.py'))) {
  throw "No se encontro backend/app/main.py en $backend"
}

$envFiles = @(
  (Join-Path $root '.env'),
  (Join-Path $backend '.env')
)

$geminiKey = if ($env:GEMINI_API_KEY) { $env:GEMINI_API_KEY } else { Get-EnvValueFromFiles -Key 'GEMINI_API_KEY' -Files $envFiles }

$backendCmd = "Set-Location '$backend'; "
if ($geminiKey) {
  $escaped = $geminiKey.Replace("'", "''")
  $backendCmd += "`$env:GEMINI_API_KEY='$escaped'; "
}
$backendCmd += "python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"
if ($Reload) { $backendCmd += ' --reload' }

$frontendCmd = "Set-Location '$frontend'; npm run dev"

if (-not (Test-PortOpen -Port 8000)) {
  Start-Process powershell -ArgumentList @('-NoExit','-Command', $backendCmd) | Out-Null
  Start-Sleep -Seconds 2
}

if (-not (Test-PortOpen -Port 3000)) {
  Start-Process powershell -ArgumentList @('-NoExit','-Command', $frontendCmd) | Out-Null
}

$healthJson = $null
$mode = 'unknown'
$healthOk = $false
for ($i = 0; $i -lt 12; $i++) {
  try {
    $healthJson = Invoke-RestMethod http://127.0.0.1:8000/health -TimeoutSec 2
    $healthOk = $true
    break
  } catch {
    Start-Sleep -Seconds 1
  }
}
if ($healthOk -and $healthJson.mode) {
  $mode = [string]$healthJson.mode
}

Write-Host ''
Write-Host 'Servicios locales' -ForegroundColor Green
Write-Host ('Frontend: http://localhost:3000 ' + ($(if (Test-PortOpen -Port 3000) { '[OK]' } else { '[NO RESPONDE]' })))
Write-Host ('Backend:  http://127.0.0.1:8000 ' + ($(if (Test-PortOpen -Port 8000) { '[OK]' } else { '[NO RESPONDE]' })))
Write-Host ('Health:   http://127.0.0.1:8000/health ' + ($(if ($healthOk) { '[OK]' } else { '[ERROR]' })))
Write-Host ('Modo IA:  ' + $mode)
if (-not $geminiKey) {
  Write-Host 'GEMINI_API_KEY: no detectada (usara modo mock)' -ForegroundColor Yellow
} else {
  Write-Host ('GEMINI_API_KEY: detectada (len=' + $geminiKey.Length + ')')
}
Write-Host ''
Write-Host 'Para detenerlos, cierra las ventanas PowerShell que se abrieron.' -ForegroundColor Yellow
