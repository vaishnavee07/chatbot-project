import re
from app.services.intent_service import Intent
from app.services.retrieval_service import get_available_courses

_GREETING = (
    "Hello! 👋 I'm your **AI Course Helpdesk Assistant**.\n\n"
    "I can help you with:\n"
    "• Explaining course topics and concepts\n"
    "• Listing all available courses\n"
    "• Answering subject-specific questions\n"
    "• Breaking down complex topics with examples\n\n"
    "What would you like to learn today?"
)

_HELP = (
    "Here's what I can do for you:\n\n"
    "📚 **Explain Topics** — Ask me to explain any concept from your courses\n"
    "📋 **List Courses** — Ask \"what courses are available?\"\n"
    "🔍 **Answer Questions** — Ask \"what is DFA?\" or \"explain JDBC\"\n"
    "💡 **Key Concepts** — I'll break down complex topics step by step\n"
    "📖 **Source Citations** — Every answer includes its source course\n\n"
    "Just type your question and I'll help you learn!"
)

_GOODBYE = "Goodbye! 👋 Good luck with your studies. Feel free to come back anytime you need help!"

_THANKS = "You're welcome! 😊 Is there anything else I can help you with?"

_NO_RESULT = (
    "I couldn't find specific information on that topic in my course materials.\n\n"
    "Try:\n"
    "• Being more specific (e.g. \"explain DFA\" instead of \"automata\")\n"
    "• Asking about a topic from one of the available courses\n"
    "• Typing \"what courses are available\" to see all subjects"
)


def _extract_topic(query: str) -> str:
    topic = query.lower()
    prefixes = [
        "what is a", "what is an", "what is", "what are", 
        "explain", "define", "describe", "elaborate on",
        "tell me about", "give me an overview of", "overview of",
        "give me", "show me", "can you explain"
    ]
    for prefix in prefixes:
        if topic.startswith(prefix):
            topic = topic[len(prefix):].strip()
            break
    return topic.strip("?").strip()


def _get_sentences(text: str) -> list:
    blocks = [b.strip() for b in text.split('\n') if b.strip()]
    sentences = []
    for b in blocks:
        parts = [s.strip() for s in re.split(r'(?<=[.!?])\s+', b) if s.strip()]
        sentences.extend(parts)
    return sentences


def _build_topic_explanation(query: str, chunks: list) -> tuple:
    if not chunks:
        return _NO_RESULT, None

    topic = _extract_topic(query)
    
    # 3. Retrieval Filtering: Rank retrieved chunks by topic relevance
    relevant_chunks = []
    for c in chunks:
        if topic and topic in c["text"].lower():
            relevant_chunks.append(c)
    
    if not relevant_chunks:
        relevant_chunks = chunks[:2]
        
    top = relevant_chunks[0]
    source = top.get("course_name", "Course Materials")

    # 4. Answer Length: Max 1 short explanation paragraph
    explanation = ""
    for chunk in relevant_chunks:
        sentences = _get_sentences(chunk["text"])
        for i, s in enumerate(sentences):
            lower_s = s.lower()
            if topic in lower_s:
                # Filter out syllabus dumps
                if lower_s.startswith("unit") or s.count("-") > 3 or len(s) < 15:
                    continue
                explanation = s
                if i + 1 < len(sentences) and not sentences[i+1].lower().startswith("unit"):
                    explanation += " " + sentences[i+1]
                break
        if explanation:
            break

    title_text = " ".join(w.capitalize() for w in topic.split()) if topic else query.strip()
    if not explanation:
        explanation = f"A detailed explanation for '{title_text}' is not explicitly provided in the course notes, but it is listed as a key concept."

    title = title_text

    key_concepts = []
    unit_lines = []

    for chunk in relevant_chunks[:2]:
        lines = [ln.strip() for ln in chunk["text"].split("\n") if ln.strip()]
        for line in lines:
            lower_line = line.lower()
            if lower_line.startswith("unit ") or lower_line.startswith("overview"):
                unit_lines.append(line.replace("#", "").strip())
            elif line.startswith("-") or line.startswith("•") or line.startswith("*"):
                concept = line.lstrip("-•* ").strip()
                if concept and len(concept) < 100:
                    key_concepts.append(concept)

    # Remove duplicates
    key_concepts = list(dict.fromkeys(key_concepts))
    unit_lines = list(dict.fromkeys(unit_lines))

    parts = [f"📖 **{title}**\n"]

    if explanation:
        parts.append(explanation)

    if key_concepts:
        # Max 5 key concepts
        concepts_block = "🔑 **Key Concepts:**\n" + "\n".join(f"  • {c}" for c in key_concepts[:5])
        parts.append(concepts_block)

    related_courses = list({c.get("course_name") for c in chunks if c.get("course_name") != source})
    
    # Max 3 related topics
    if unit_lines:
        related_block = "🔗 **Related Topics:**\n" + "\n".join(f"  • {u}" for u in unit_lines[:3])
        parts.append(related_block)
    elif related_courses:
        related_block = "🔗 **Also Covered In:**\n" + "\n".join(f"  • {r}" for r in related_courses[:3])
        parts.append(related_block)

    return "\n\n".join(parts), source


def _build_course_info(query: str, chunks: list) -> tuple:
    if not chunks:
        return _NO_RESULT, None

    topic = _extract_topic(query)
    
    relevant_chunks = []
    for c in chunks:
        if topic and topic in c["course_name"].lower():
            relevant_chunks.append(c)
    if not relevant_chunks:
        relevant_chunks = chunks

    top = relevant_chunks[0]
    source = top.get("course_name", "Course Materials")

    title = query.strip().rstrip("?").strip()
    title = " ".join(w.capitalize() for w in title.split())
    if "Tell Me About" in title:
        title = title.replace("Tell Me About", "").strip()

    overview_lines = []
    major_topics = []
    applications = []

    for chunk in relevant_chunks[:3]:
        text = chunk["text"]
        sentences = _get_sentences(text)
        if not overview_lines and sentences:
            # Grab non-syllabus sentences for overview
            for s in sentences:
                if not s.lower().startswith("unit") and s.count("-") < 3 and len(s) > 20:
                    overview_lines.append(s)
                    if len(overview_lines) >= 2:
                        break
                
        lines = [ln.strip() for ln in text.split("\n") if ln.strip()]
        for line in lines:
            lower_line = line.lower()
            if "application" in lower_line or "use case" in lower_line or "used in" in lower_line:
                applications.append(line.replace("#", "").strip())
            elif lower_line.startswith("unit ") or lower_line.startswith("chapter "):
                major_topics.append(line.replace("#", "").strip())

    overview = " ".join(overview_lines[:2])
    if len(overview) > 400:
        overview = overview[:400] + "..."
    
    parts = [f"📖 **{title} (Course Overview)**\n"]
    if overview:
        parts.append(overview)
        
    if major_topics:
        unique_topics = list(dict.fromkeys([t for t in major_topics if len(t) > 3]))
        topics_block = "📑 **Major Topics:**\n" + "\n".join(f"  • {t}" for t in unique_topics[:5])
        parts.append(topics_block)

    if applications:
        unique_apps = list(dict.fromkeys([a for a in applications if len(a) > 3]))
        apps_block = "🚀 **Applications:**\n" + "\n".join(f"  • {a}" for a in unique_apps[:3])
        parts.append(apps_block)
    else:
        parts.append("🚀 **Applications:**\n  • General theory and practical implementation.")

    return "\n\n".join(parts), source


def generate_answer(intent: Intent, query: str, chunks: list) -> tuple:
    if intent == Intent.GREETING:
        return _GREETING, None
    if intent == Intent.HELP:
        return _HELP, None
    if intent == Intent.THANKS:
        return _THANKS, None
    if intent == Intent.GOODBYE:
        return _GOODBYE, None
    if intent == Intent.COURSE_LIST:
        courses = get_available_courses()
        if not courses:
            return "No course files found in the data directory.", None
        
        parts = ["**Available Courses:**\n"]
        for idx, course in enumerate(courses, 1):
            parts.append(f"{idx}. {course}")
            
        return "\n".join(parts), None
        
    if intent == Intent.COURSE_INFO:
        return _build_course_info(query, chunks)

    # Fallback / TOPIC_EXPLANATION
    return _build_topic_explanation(query, chunks)
