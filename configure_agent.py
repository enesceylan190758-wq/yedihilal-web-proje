import os
from dotenv import load_dotenv
from retell import Retell

load_dotenv()

api_key = os.getenv("RETELL_API_KEY")
agent_id = os.getenv("RETELL_AGENT_ID")
ngrok_url = os.getenv("LLM_WEBSOCKET_URL")

if not ngrok_url:
    print("❌ LLM_WEBSOCKET_URL .env dosyasında tanımlı değil.")
    print("   Örnek: wss://xxxx.ngrok-free.app/llm-websocket")
    exit(1)

client = Retell(api_key=api_key)

print(f"YediHilal agent güncelleniyor: {agent_id}...")
try:
    response = client.agent.update(
        agent_id=agent_id,
        agent_name="YediHilal Sesli Asistan",
        language="tr-TR",
        response_engine={
            "type": "custom-llm",
            "llm_websocket_url": ngrok_url,
        },
    )
    print("✅ Agent başarıyla güncellendi!")
    print(f"Websocket URL: {response.response_engine.llm_websocket_url}")
except Exception as e:
    print(f"❌ Agent güncellenirken hata: {e}")
