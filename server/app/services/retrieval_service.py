import os
from app.core.vectorstore import vector_store
from app.config.settings import TOP_K, SIMILARITY_THRESHOLD, DATA_DIR
from app.utils.text_utils import slugify_to_name


def get_available_courses() -> list:
    courses = []
    try:
        for filename in sorted(os.listdir(DATA_DIR)):
            if filename.endswith(".txt"):
                courses.append(slugify_to_name(filename))
    except OSError:
        pass
    return courses


def retrieve(query: str) -> list:
    if not vector_store.ready:
        return []
    raw = vector_store.search(query, k=TOP_K)
    filtered = [r for r in raw if r.get("score", 9999) <= SIMILARITY_THRESHOLD]
    return sorted(filtered, key=lambda x: x.get("score", 9999))
