import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from app.config.settings import VECTORSTORE_DIR, MODEL_NAME, TOP_K


class VectorStore:
    def __init__(self):
        self.index = None
        self.documents = []
        self.model = None
        self._ready = False

    def load(self):
        self.model = SentenceTransformer(MODEL_NAME)
        self.index = faiss.read_index(str(VECTORSTORE_DIR / "courses.index"))
        with open(VECTORSTORE_DIR / "docs.json", "r", encoding="utf-8") as f:
            self.documents = json.load(f)
        self._ready = True

    @property
    def ready(self) -> bool:
        return self._ready

    def search(self, query: str, k: int = TOP_K) -> list:
        if not self._ready:
            return []
        embedding = self.model.encode(query, convert_to_numpy=True).reshape(1, -1).astype("float32")
        distances, indices = self.index.search(embedding, k)
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if 0 <= idx < len(self.documents):
                doc = dict(self.documents[idx])
                doc["score"] = float(dist)
                results.append(doc)
        return results


vector_store = VectorStore()
