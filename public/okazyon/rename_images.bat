@echo off
setlocal enabledelayedexpansion

set count=1

for %%f in (*.jpg *.jpeg *.png *.webp *.bmp) do (
    ren "%%f" "!count!%%~xf"
    set /a count+=1
)

echo Done!
pause
