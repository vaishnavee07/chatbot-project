import re
from enum import Enum


class Intent(str, Enum):
    GREETING = "greeting"
    COURSE_LIST = "course_list"
    COURSE_INFO = "course_info"
    TOPIC_EXPLANATION = "topic_explanation"
    HELP = "help"
    THANKS = "thanks"
    GOODBYE = "goodbye"
    UNKNOWN = "unknown"


_PATTERNS = {
    Intent.GREETING: [
        r"^(hi|hello|hey|hii|helo|howdy|greetings|yo|sup|what'?s up)[\s!.]*$",
        r"^good\s?(morning|afternoon|evening|day)[\s!.]*$",
    ],
    Intent.COURSE_LIST: [
        r"^(what courses are available|show all courses|list courses|available subjects)",
        r"\b(list|show|display|what|all|available|which)\b.{0,30}\b(course|courses|subject|subjects)\b",
    ],
    Intent.COURSE_INFO: [
        r"^(tell me about|explain|what is)\s+(compiler design|computer networks|financial management|advanced java|aptitude|aiml|software engineering|oracle academy)",
        r"\b(overview|about|info|information)\b.{1,20}\b(course|subject)\b",
    ],
    Intent.HELP: [
        r"^(help|assist|support)[\s!.?]*$",
        r"\bwhat can you (do|help|offer|teach)\b",
    ],
    Intent.THANKS: [
        r"^(thank|thanks|thank you|thx|ty|cheers|appreciate|grateful)[\s!.]*$",
    ],
    Intent.GOODBYE: [
        r"^(bye|goodbye|see you|cya|exit|quit|later|farewell|take care|good night)[\s!.]*$",
    ],
    Intent.TOPIC_EXPLANATION: [
        r"^(explain|define|describe|elaborate|detail|what is|what are|how does|how do|give me|show me)\b",
    ],
}


def classify_intent(text: str) -> Intent:
    text_lower = text.lower().strip()
    for intent, patterns in _PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text_lower):
                return intent
    return Intent.UNKNOWN
