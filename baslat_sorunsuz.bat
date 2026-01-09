@echo off
echo ==========================================
echo   Retell AI Custom LLM Server (Gemini) - Otomatik
echo ==========================================

echo.
echo Adim 1: Kutuphaneler kontrol ediliyor...
"C:\Users\Admin\AppData\Local\Programs\Python\Python312\python.exe" -m pip install -r requirements.txt

echo.
echo Adim 2: Ngrok baslatiliyor...
start cmd /k ".\ngrok.exe http 8080"

echo.
echo Adim 3: Python sunucusu baslatiliyor...
"C:\Users\Admin\AppData\Local\Programs\Python\Python312\python.exe" custom_llm_server.py
pause
