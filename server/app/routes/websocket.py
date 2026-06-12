import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.intent_service import classify_intent, Intent
from app.services.retrieval_service import retrieve
from app.services.answer_service import generate_answer
from app.utils.text_utils import sanitize_input

router = APIRouter()

_WELCOME = (
    "Hello! 👋 I'm your **AI Course Helpdesk Assistant**.\n\n"
    "Ask me anything about your courses. Type **\"what courses are available\"** to see all subjects!"
)


@router.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    await ws.send_json({"type": "message", "role": "bot", "text": _WELCOME, "source": None, "intent": "greeting"})

    try:
        while True:
            raw = await ws.receive_text()

            try:
                data = json.loads(raw)
                user_text = sanitize_input(data.get("text", ""))
            except (json.JSONDecodeError, AttributeError):
                await ws.send_json({"type": "error", "text": "Invalid message format."})
                continue

            if not user_text:
                await ws.send_json({"type": "error", "text": "Message cannot be empty."})
                continue

            await ws.send_json({"type": "typing", "value": True})

            intent = classify_intent(user_text)

            static_intents = {Intent.GREETING, Intent.HELP, Intent.THANKS, Intent.GOODBYE, Intent.COURSE_LIST}
            chunks = [] if intent in static_intents else retrieve(user_text)

            answer, source = generate_answer(intent, user_text, chunks)

            await ws.send_json({
                "type": "message",
                "role": "bot",
                "text": answer,
                "source": source,
                "intent": intent.value,
            })
            await ws.send_json({"type": "typing", "value": False})

    except WebSocketDisconnect:
        pass
    except Exception:
        try:
            await ws.send_json({"type": "error", "text": "An unexpected error occurred. Please try again."})
        except Exception:
            pass
