import re


def slugify_to_name(filename: str) -> str:
    name = filename.replace(".txt", "").replace("_", " ")
    return " ".join(word.capitalize() for word in name.split())


def sanitize_input(text: str) -> str:
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"[^\w\s.,!?'\-]", " ", text)
    text = " ".join(text.split())
    return text[:500]


def chunk_text(text: str, max_chars: int = 450) -> list:
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    chunks = []
    current = ""
    for para in paragraphs:
        if len(current) + len(para) + 2 <= max_chars:
            current = (current + "\n\n" + para).strip()
        else:
            if current:
                chunks.append(current)
            current = para
    if current:
        chunks.append(current)
    return chunks if chunks else [text[:max_chars]]
