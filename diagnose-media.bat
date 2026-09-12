@echo off
echo === Checking git's line-ending setting ===
git config --get core.autocrlf
echo (If that says "true", git may have been converting your binary
echo  video/image files as if they were text on commit, which corrupts them.)
echo.

echo === Adding .gitattributes to force binary handling for media ===
(
echo *.mp4 binary
echo *.mov binary
echo *.webm binary
echo *.jpg binary
echo *.jpeg binary
echo *.png binary
echo *.webp binary
) > .gitattributes
echo Done. This is now committed protection going forward.
echo.

echo === Every file currently in public\media\work, with real sizes ===
for /r public\media\work %%f in (*) do echo %%~zf bytes   %%f
echo.

echo Look at the sizes above. A real photo should be several hundred KB
echo to a few MB. A real video should be several MB at least. Anything
echo showing 0 or a suspiciously tiny number (under 1000 bytes) is broken.
echo Also note if ANY file is close to 100,000,000 bytes (100 MB) or
echo more, GitHub silently rejects files over that size on push.
echo.
pause
