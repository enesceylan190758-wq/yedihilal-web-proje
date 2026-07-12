@echo off
echo ==========================================
echo   YediHilal Sesli Asistan (Gemini + Retell)
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
echo Web demo: http://localhost:8080
echo Ngrok URL'sini .env dosyasindaki LLM_WEBSOCKET_URL alanina yazin.
echo Agent ayari icin: python configure_agent.py
echo.
echo (Durdurmak icin CTRL + C tusuna basin)
echo.

python custom_llm_server.py
pause
