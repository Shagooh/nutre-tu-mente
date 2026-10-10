# Comparte la app por internet con un enlace temporal (localhost.run).
# Uso:  .\compartir.ps1              -> usa la última versión generada
#       .\compartir.ps1 -Reconstruir -> vuelve a generar la versión web antes
param(
  [switch]$Reconstruir,
  [int]$Puerto = 8090
)

Set-Location $PSScriptRoot

if ($Reconstruir -or -not (Test-Path 'dist-web/index.html')) {
  Write-Host 'Generando la versión web...' -ForegroundColor Cyan
  npx expo export --platform web --output-dir dist-web
  if ($LASTEXITCODE -ne 0) { Write-Host 'No se pudo generar la versión web.' -ForegroundColor Red; exit 1 }
}

Write-Host "Iniciando servidor local en el puerto $Puerto..." -ForegroundColor Cyan
$servidor = Start-Process python -ArgumentList '-m', 'http.server', $Puerto, '--bind', '127.0.0.1', '--directory', 'dist-web' `
  -WindowStyle Hidden -PassThru

try {
  Write-Host 'Abriendo el túnel... (Ctrl + C para cerrarlo)' -ForegroundColor Cyan
  ssh -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30 -R "80:127.0.0.1:$Puerto" nokey@localhost.run 2>&1 |
    ForEach-Object {
      $linea = "$_"
      if ($linea -match 'https://\S+\.lhr\.life') {
        Write-Host ''
        Write-Host "  Enlace para compartir:  $($Matches[0])" -ForegroundColor Green
        Write-Host ''
      }
      elseif ($linea -match 'denied|refused|error|failed') {
        Write-Host $linea -ForegroundColor Red
      }
    }
}
finally {
  Stop-Process -Id $servidor.Id -Force -ErrorAction SilentlyContinue
  Write-Host 'Túnel y servidor cerrados.' -ForegroundColor Yellow
}
