import os
import re
import json
from pathlib import Path
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
VECTORSTORE_DIR = BASE_DIR / "vectorstore"
VECTORSTORE_DIR.mkdir(exist_ok=True)

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


def slugify_to_name(filename: str) -> str:
    name = filename.replace(".txt", "").replace("_", " ")
    return " ".join(word.capitalize() for word in name.split())


def chunk_text(text: str, chunk_size: int = 600, overlap: int = 150) -> list:
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        if end < len(text):
            # Try to find a space or period near the end to avoid splitting words
            last_space = text.rfind(' ', start, end)
            if last_space != -1 and last_space > start + chunk_size // 2:
                end = last_space
        chunks.append(text[start:end].strip())
        start = end - overlap
    return chunks if chunks else [text[:chunk_size]]


model = SentenceTransformer(MODEL_NAME)

documents = []
vectors = []

for filename in sorted(os.listdir(DATA_DIR)):
    if not filename.endswith(".txt"):
        continue

    course_name = slugify_to_name(filename)
    path = DATA_DIR / filename

    with open(path, "r", encoding="utf-8") as f:
        text = f.read()

    chunks = chunk_text(text)

    for i, chunk in enumerate(chunks):
        emb = model.encode(chunk, convert_to_numpy=True)
        documents.append({
            "filename": filename,
            "course_name": course_name,
            "chunk_index": i,
            "chunk_total": len(chunks),
            "char_count": len(chunk),
            "text": chunk,
        })
        vectors.append(emb)

vectors_np = np.vstack(vectors).astype("float32")

dim = vectors_np.shape[1]
index = faiss.IndexFlatL2(dim)
index.add(vectors_np)

faiss.write_index(index, str(VECTORSTORE_DIR / "courses.index"))

with open(VECTORSTORE_DIR / "docs.json", "w", encoding="utf-8") as f:
    json.dump(documents, f, indent=2, ensure_ascii=False)
