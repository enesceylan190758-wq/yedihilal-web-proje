import os
import google.generativeai as genai
from yedihilal_knowledge import GREETING_MESSAGE, YEDIHILAL_SYSTEM_PROMPT


class LlmClient:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def draft_begin_message(self):
        return {
            "response_id": 0,
            "content": GREETING_MESSAGE,
            "content_complete": True,
            "end_call": False,
        }

    async def draft_response(self, request_data):
        transcript = request_data.get("transcript", [])

        conversation_history = []
        for turn in transcript:
            role = "model" if turn["role"] == "agent" else "user"
            conversation_history.append({"role": role, "parts": [turn["content"]]})

        full_prompt = f"{YEDIHILAL_SYSTEM_PROMPT}\n\nKonuşma geçmişi:\n"
        for msg in conversation_history:
            full_prompt += f"{msg['role']}: {msg['parts'][0]}\n"
        full_prompt += "model: "

        response = await self.model.generate_content_async(full_prompt, stream=True)

        async for chunk in response:
            if chunk.text:
                yield {
                    "response_id": request_data["response_id"],
                    "content": chunk.text,
                    "content_complete": False,
                    "end_call": False,
                }

        yield {
            "response_id": request_data["response_id"],
            "content": "",
            "content_complete": True,
            "end_call": False,
        }
