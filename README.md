# Scout - Accessible Voice-Based AI Property Assistant

![Property Assistant Architecture](https://img.shields.io/badge/Architecture-FastAPI%20%7C%20Next.js%20%7C%20Groq-blue)

A complete end-to-end Voice AI Agent for the Bengaluru real-estate market, with a strong emphasis on accessibility (WCAG) and physical mobility constraints. This capstone project orchestrates a Next.js frontend with a FastAPI backend to ingest user voice commands, dynamically construct structured queries, retrieve ground-truth vector embeddings (RAG), and ultimately display filtered properties alongside rich neighborhood insights.

## Features

1. **Accessible UI & Voice-to-Text:** A high-contrast, WCAG-friendly frontend with integrated Web Speech API for seamless, hands-free conversational property search.
2. **RAG (Retrieval-Augmented Generation):** Utilizes `ChromaDB` to store and query unstructured insights about Bengaluru neighborhoods (safety, commute, pedestrian accessibility).
3. **LLM Orchestration:** Powered by `openai/gpt-oss-120b` via the Groq SDK, the agent manages conversational state and dynamically invokes backend tools (e.g. SQLite property searches) when sufficient constraints (budget, step-free access) are gathered.
4. **Evaluation Framework (CI/CD Evals):** Built-in offline evaluation scripts using an *LLM-as-a-judge* pattern to guarantee strict adherence to physical accessibility constraints, budget rules, and zero RAG hallucinations.

## Project Structure

```
├── backend/
│   ├── main.py          # FastAPI application & endpoints (/chat, /transcribe)
│   ├── agent.py         # Groq LLM tool-calling loop and system prompts
│   ├── tools.py         # SQLite DB queries and ChromaDB RAG queries
│   ├── build_rag.py     # Script to chunk and embed neighborhood data
│   └── properties.db    # SQLite database of Bengaluru properties
├── frontend/
│   ├── src/app/         # Next.js 14 App Router layout & pages
│   ├── src/components/  # VoiceChat, PropertyCard, NeighborhoodSnapshot
│   └── vercel.json      # Vercel deployment configuration
├── evals/
│   ├── run_evals.py     # The Master evaluation test runner
│   ├── eval_*.py        # Heuristic and LLM-based evaluation metrics
├── render.yaml          # Blueprint for deploying the backend to Render.com
└── .env                 # API Keys (Groq, STT, Database)
```

## Setup & Run Locally

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- A [Groq API Key](https://console.groq.com/) for fast LLM inference.
- An STT Key (e.g., Deepgram/HuggingFace).

### 2. Backend Initialization
```bash
cd capstone
# Install dependencies
python -m venv venv
venv\Scripts\activate
pip install -r backend/requirements.txt

# Start the FastAPI server
python -m uvicorn backend.main:app --reload
```
*The backend will run on `http://127.0.0.1:8000`.*

### 3. Frontend Initialization
```bash
cd capstone/frontend
# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```
*The UI will be accessible at `http://localhost:3000`.*

## Deployment

To take this application live:
1. **Frontend:** Connect your GitHub repo to [Vercel](https://vercel.com). The `vercel.json` file is already configured to automatically proxy `/api` requests to your hosted backend.
2. **Backend:** Connect your GitHub repo to [Render](https://render.com) using the provided `render.yaml` blueprint. Add your `.env` secrets into the Render dashboard!

## Running Evaluations
To verify the system's accuracy against constraints and hallucinations, run the offline evaluation framework:
```bash
python evals/run_evals.py
```
This tests the Feasibility (budget and accessibility enforcement), Edit Correctness (voice filtering such as requesting wide doors or reserved parking), and Grounding (hallucination checks).
