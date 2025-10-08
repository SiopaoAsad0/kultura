@echo off
echo ========================================
echo   STARTING KULTURA PLATFORM
echo ========================================
echo.
echo Starting Backend Server...
start cmd /k "cd backend && php artisan serve"
echo.
timeout /t 3 /nobreak
echo.
echo Starting Frontend Server...
start cmd /k "cd frontend && npm start"
echo.
echo ========================================
echo   KULTURA IS STARTING!
echo ========================================
echo.
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
