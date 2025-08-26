@echo off
echo Starting ClassSYNC Backend Server...
echo.

echo Checking if MongoDB is running...
netstat -an | findstr ":27017" >nul
if %errorlevel% neq 0 (
    echo MongoDB is not running. Please start MongoDB first.
    echo You can start MongoDB by running: mongod
    pause
    exit /b 1
)

echo MongoDB is running.
echo.

echo Installing dependencies...
npm install

echo.
echo Seeding database with demo data...
node seed-database.js

echo.
echo Starting server...
npm start

pause
