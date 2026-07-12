import os
from dotenv import load_dotenv
from retell import Retell

load_dotenv()

api_key = os.getenv("RETELL_API_KEY")
source_agent_id = os.getenv("RETELL_AGENT_ID")
ngrok_url = os.getenv("LLM_WEBSOCKET_URL")

if not ngrok_url:
    print("❌ LLM_WEBSOCKET_URL .env dosyasında tanımlı değil.")
    print("   Örnek: wss://xxxx.ngrok-free.app/llm-websocket")
    exit(1)

client = Retell(api_key=api_key)

print(f"Kaynak agent okunuyor: {source_agent_id}...")
try:
    source_agent = client.agent.retrieve(source_agent_id)
    voice_id = source_agent.voice_id
    print(f"voice_id: {voice_id}")

    print("Yeni YediHilal Custom Agent oluşturuluyor...")
    new_agent = client.agent.create(
        agent_name="YediHilal Sesli Asistan",
        voice_id=voice_id,
        language="tr-TR",
        response_engine={
            "type": "custom-llm",
            "llm_websocket_url": ngrok_url,
        },
    )

    print("✅ Yeni agent oluşturuldu!")
    print(f"Agent ID: {new_agent.agent_id}")
    print(f"Websocket URL: {new_agent.response_engine.llm_websocket_url}")
    print("\nBu ID'yi .env dosyasındaki RETELL_AGENT_ID olarak kaydedin.")

except Exception as e:
    print(f"❌ Hata: {e}")
