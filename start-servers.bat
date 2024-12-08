@echo off
echo Starting servers...

:: Start the backend server in a new window
start cmd /k "npm run server"

:: Wait for 2 seconds to let the backend server start
timeout /t 2 /nobreak

:: Start the frontend server in a new window
start cmd /k "npm run dev"

echo Servers started!
echo Frontend: http://localhost:5173/client-login
echo Backend: http://localhost:3001
