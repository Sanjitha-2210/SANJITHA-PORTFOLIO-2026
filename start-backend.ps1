Write-Host "Starting FastAPI Backend on port 8000..." -ForegroundColor Green
Set-Location "$PSScriptRoot"
$env:PYTHONPATH = "backend"
.\backend\venv\Scripts\python.exe backend\run.py
