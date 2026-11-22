Write-Host "Starting Next.js 15 Frontend on port 3001..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\frontend"

# Clean stale cache to prevent chunk mismatch runtime errors
if (Test-Path ".next") {
    Write-Host "Clearing .next cache for clean startup..." -ForegroundColor Yellow
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
}

npm run dev
