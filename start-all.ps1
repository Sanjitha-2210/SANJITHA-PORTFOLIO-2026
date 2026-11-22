Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Portfolio CMS: FastAPI (8000) & Next.js 15 (3001)     " -ForegroundColor Green
Write-Host "   (Port 3000 is intentionally preserved for your other project!)" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

$root = $PSScriptRoot

# Clean stale cache to avoid Webpack chunk mismatch errors
if (Test-Path "$root\frontend\.next") {
    Remove-Item -Path "$root\frontend\.next" -Recurse -Force -ErrorAction SilentlyContinue
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root'; Write-Host 'FastAPI Backend (Port 8000)' -ForegroundColor Green; Set-Item -Path env:PYTHONPATH -Value 'backend'; .\backend\venv\Scripts\python.exe backend\run.py"

Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\frontend'; Write-Host 'Next.js Frontend (Port 3001)' -ForegroundColor Cyan; npm run dev"

Write-Host "Both processes launched in separate terminal windows!" -ForegroundColor Green
Write-Host "  Public Portfolio: http://localhost:3001" -ForegroundColor White
Write-Host "  Admin CMS Portal: http://localhost:3001/admin/dashboard" -ForegroundColor White
Write-Host "  FastAPI Docs:     http://localhost:8000/docs" -ForegroundColor White
Write-Host "  Default Admin:    admin / admin123456" -ForegroundColor Yellow
Write-Host ""
