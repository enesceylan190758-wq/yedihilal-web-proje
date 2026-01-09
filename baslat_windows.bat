@echo off
echo ==========================================
echo   Retell AI Custom LLM Server (Gemini)
echo ==========================================

echo.
echo Adim 1: Kutuphaneler kontrol ediliyor...
pip install -r requirements.txt

echo.
echo Adim 2: Ngrok baslatiliyor (Tunel aciliyor)...
start cmd /k "ngrok http 8080"

echo.
echo Adim 3: Python sunucusu baslatiliyor...
echo.
echo Sunucu aktif. Retell Dashboard'a Ngrok URL'sini girmeyi unutmayin!
echo (Durdurmak icin CTRL + C tusuna basin)
echo.

python custom_llm_server.py
pause
