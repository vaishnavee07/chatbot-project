from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.websocket import router
from app.core.vectorstore import vector_store
from app.config.settings import CORS_ORIGINS


@asynccontextmanager
async def lifespan(app: FastAPI):
    vector_store.load()
    yield


app = FastAPI(title="AI Course Helpdesk Assistant", version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
