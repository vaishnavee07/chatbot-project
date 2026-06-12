# AI Course Helpdesk Assistant

## Overview
The AI Course Helpdesk Assistant is an offline, AI-powered educational RAG (Retrieval-Augmented Generation) chatbot. It is designed to help students study by providing dynamic topic explanations, course lists, and structured answers with source citations, all using local text course materials without relying on external cloud LLM APIs.

## Features
* **Offline RAG Chatbot:** Runs locally without cloud dependencies.
* **Dynamic Course Detection:** Automatically detects available courses from the dataset.
* **Intent Detection:** Uses regular expressions and keyword matching to identify Greetings, Thanks, Course List, Topic Explanations, Help, and unknown queries.
* **FAISS Vector Search:** Uses Facebook AI Similarity Search for fast document chunk retrieval.
* **Structured Answers:** Responses are formatted into distinct sections (Explanation, Key Concepts, Examples, Related Topics) rather than dumping raw notes.
* **Source Citations:** Accurately cites the source course material.
* **WebSocket Communication:** Uses WebSockets for real-time streaming and typing indicators.
* **FastAPI Backend:** Lightweight and scalable backend service.
* **React Frontend:** Simple, clean, academic UI designed for a student project.

## Tech Stack

**Frontend:**
* React 18
* Vite
* Vanilla CSS (No heavy UI frameworks)

**Backend:**
* FastAPI
* Uvicorn
* FAISS (faiss-cpu)
* Sentence Transformers (all-MiniLM-L6-v2)
* WebSockets

## Project Structure
```
chatbot-project/
├── .env.example
├── .gitignore
├── README.md
├── frontend/                 # React UI
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── components/       # ChatWindow, MessageBubble, InputBar, etc.
│       ├── context/          # ChatContext
│       ├── hooks/            # useWebSocket, useLocalStorage, useAutoScroll
│       ├── pages/            # ChatPage
│       ├── styles/           # globals.css
│       └── utils/            # formatMessage.js, courseHelpers.js
└── server/                   # FastAPI Backend
    ├── main.py               # Application entry point
    ├── ingest_courses.py     # Script to chunk and build the FAISS index
    ├── requirements.txt
    ├── app/
    │   ├── config/           # settings.py
    │   ├── core/             # vectorstore.py (Singleton pattern)
    │   ├── models/           # schemas.py (Pydantic validation)
    │   ├── routes/           # websocket.py
    │   ├── services/         # intent_service, retrieval_service, answer_service
    │   └── utils/            # text_utils.py (chunking logic)
    ├── data/                 # Raw course text files (.txt)
    └── vectorstore/          # Generated FAISS index and metadata
```

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env` in the root directory and configure if needed.
```bash
# In the root folder (chatbot-project/)
cp .env.example .env
```
*(No API keys are required for the offline model. Ensure your real `.env` is never committed to Git.)*

### 2. Backend Setup
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   
   # Windows:
   .venv\Scripts\activate
   
   # Mac/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Place your course `.txt` files in `server/data/`.
5. Run the data ingestion script to build the vector index:
   ```bash
   python ingest_courses.py
   ```

### 3. Frontend Setup
1. Open a separate terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```

## Running The Project Locally

You need two terminals running simultaneously (one for the backend, one for the frontend).

**Terminal 1: Start the Backend**
```bash
# Navigate to the server folder
cd server

# Activate the virtual environment if you haven't already
# Windows: .venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate

# Run the backend server
python -m uvicorn main:app --port 8000 --reload
```

**Terminal 2: Start the Frontend**
```bash
# Navigate to the frontend folder
cd frontend

# Run the Vite dev server
npm run dev
```

Finally, open your browser to [http://localhost:5173](http://localhost:5173).

## Future Enhancements
* **Ollama Integration:** Transitioning to local open-source LLMs.
* **Llama 3 Support:** Upgrade the embedding and generation models.
* **PDF Upload:** Allow students to upload their own course materials.
* **Quiz Generator:** Automatically generate practice quizzes from course context.
* **Flashcards:** Anki-style flashcard generation for spaced repetition.
* **Study Planner:** Calendar integration for learning objectives.

## Author
**Student Project**
