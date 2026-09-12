@echo off
echo Stopping any running Node processes...
taskkill /IM node.exe /F >nul 2>&1

if exist organize-media1.js (
  del organize-media1.js
  echo Removed duplicate organize-media1.js
)

echo.
findstr /C:"piece-7" lib\projects.ts >nul
if %errorlevel% equ 0 (
  echo Found piece-7 in lib\projects.ts - your entries are there.
) else (
  echo piece-7 was NOT found in lib\projects.ts - run organize-media.js again before continuing.
)
echo.
pause

echo Starting a clean dev server...
npm run dev
