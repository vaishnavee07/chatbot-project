from pydantic import BaseModel
from typing import Optional


class IncomingMessage(BaseModel):
    type: str = "message"
    text: str


class RetrievedChunk(BaseModel):
    course_name: str
    filename: str
    chunk_index: int
    text: str
    score: float


class BotResponse(BaseModel):
    type: str = "message"
    role: str = "bot"
    text: str
    source: Optional[str] = None
    intent: Optional[str] = None
