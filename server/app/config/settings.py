from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
VECTORSTORE_DIR = BASE_DIR / "vectorstore"

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
TOP_K = 5
SIMILARITY_THRESHOLD = 1.6

CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
