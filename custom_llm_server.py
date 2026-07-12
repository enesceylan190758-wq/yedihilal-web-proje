import asyncio
import os
import json
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from retell import Retell
from llm_client import LlmClient

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("yedihilal_voice_assistant")

app = FastAPI(title="YediHilal Sesli Asistan")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

retell = Retell(api_key=os.getenv("RETELL_API_KEY"))
llm_client = LlmClient()


class RegisterCallResponse(BaseModel):
    access_token: str


@app.post("/register-call", response_model=RegisterCallResponse)
async def register_call():
    agent_id = os.getenv("RETELL_AGENT_ID")
    if not agent_id:
        raise HTTPException(status_code=500, detail="RETELL_AGENT_ID not set in .env")

    try:
        call_response = retell.call.register(agent_id=agent_id)
        logger.info(f"Call registered: {call_response.call_id}")
        return {"access_token": call_response.access_token}
    except Exception as e:
        logger.error(f"Error registering call: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def serve_demo():
    return FileResponse("index.html")


@app.websocket("/llm-websocket/{call_id}")
async def websocket_endpoint(websocket: WebSocket, call_id: str):
    await websocket.accept()
    logger.info(f"WebSocket connected for call: {call_id}")

    try:
        first_event = await websocket.receive_text()
        first_data = json.loads(first_event)

        if first_data["interaction_type"] == "call_details":
            logger.info("Received call details, sending greeting")
            greeting = llm_client.draft_begin_message()
            await websocket.send_json(greeting)

        async for data in websocket.iter_json():
            if data["interaction_type"] == "update_only":
                continue

            if data["interaction_type"] == "response_required":
                logger.info(f"Response required for transcript length: {len(data.get('transcript', []))}")
                async for chunk in llm_client.draft_response(data):
                    await websocket.send_json(chunk)

            if data["interaction_type"] == "reminder_required":
                async for chunk in llm_client.draft_response(data):
                    await websocket.send_json(chunk)

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for call: {call_id}")
    except Exception as e:
        logger.error(f"Error in websocket: {e}")
        await websocket.close()


@app.post("/webhook")
async def handle_webhook(request: dict):
    return JSONResponse(status_code=200, content={"received": True})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8080)
