# Architecture: Voice-Based AI Property Assistant

This document outlines the high-level architecture and system components required to build the Voice-Based AI Property Assistant.

## High-Level Architecture Diagram

```mermaid
graph TD
    %% Frontend
    subgraph Frontend ["Companion UI (Client)"]
        UI[Web UI Interface]
        VoiceIn[Voice Input/STT]
    end

    %% Backend Orchestration
    subgraph Backend ["Orchestration Layer (Backend)"]
        Agent[AI Agent / LLM Orchestrator]
        State[Conversation State & Context]
        Intent[Intent & Preference Extraction]
    end

    %% Tools and Integrations
    subgraph Integrations ["Integrations & Tools"]
        MCP[OpenStreetMap MCP Server]
        n8n[n8n Workflow Automation]
    end

    %% Data Layer
    subgraph DataLayer ["Data Layer"]
        DB[(Property Listings Database)]
        VectorDB[(Vector DB - Neighborhood Data)]
    end

    %% External APIs
    LLM[Groq API (LLM Provider)]

    %% Connections
    UI <-->|Text/JSON| Backend
    VoiceIn -->|Transcribed Text| UI
    
    Agent <-->|Prompts/Responses| LLM
    Agent -->|Queries| DB
    Agent -->|RAG Queries| VectorDB
    Agent -->|Function Calls| MCP
    Agent -->|Webhook Trigger| n8n
    
    State <--> Agent
    Intent --> Agent
```

## System Components

### 1. Companion UI (Frontend)
- **Tech Stack:** React / Next.js (or lightweight HTML/Vanilla JS)
- **Responsibilities:**
  - Capture user voice input and convert it to text (e.g., using the browser's Web Speech API or external APIs like Whisper).
  - Display the shortlist cards, neighborhood snapshot panel, and visit-confirmation panel.
  - Show live transcripts and a dedicated "Sources" or "References" section for neighborhood claims.

### 2. Orchestration Layer (Backend)
- **Tech Stack:** Python (FastAPI/LangChain) or Node.js (Express/AI SDK)
- **Responsibilities:**
  - Manages the core conversation loop and state (max 5 clarifying questions).
  - Uses an LLM with Tool Use / Function Calling to orchestrate actions.
  - Extracts user preferences (budget, bedrooms, must-haves) and updates constraints.
  - Filters, refines, and justifies the shortlist based on extracted constraints and voice edits.

### 3. Data Layer
- **Property Listings Database:** 
  - **Tech Stack:** PostgreSQL, SQLite, or MongoDB.
  - **Purpose:** Stores the cleaned, pre-scraped listings from `bengaluru.rent`. Excludes "Not for rent" pins and ensures all PII is completely stripped.
- **RAG Vector Database:**
  - **Tech Stack:** ChromaDB, Pinecone, or pgvector.
  - **Embedding Model:** BGE model (BAAI General Embedding).
  - **Purpose:** Stores vector embeddings of neighborhood practical guidance, safety notes, and character data extracted from [https://bengaluru.rent/](https://bengaluru.rent/). Used to fetch context and citations to ground the LLM's explanations.

### 4. Integrations & Tooling
- **OpenStreetMap MCP:**
  - **Tech Stack:** MCP Protocol.
  - **Repository:** [https://github.com/jagan-shanmugam/open-streetmap-mcp](https://github.com/jagan-shanmugam/open-streetmap-mcp)
  - **Purpose:** Called dynamically by the orchestration layer to fetch nearby amenities, transit points, and POI data around a listing's location. Ensures data is structured and factual, not guessed.
- **n8n Workflow Automation:**
  - **Tech Stack:** n8n.
  - **Purpose:** A webhook or API trigger called by the backend once the user finalizes a shortlist. It compiles the JSON shortlist into a PDF and emails it to the user.

### 5. Evaluation Framework (Evals)
- **Tech Stack:** Python evaluation scripts (rule-based or LLM-assisted using frameworks like LangSmith or promptfoo).
- **Purpose:** Offline evaluation suite to test system constraints:
  - **Feasibility Eval:** Validates if the generated shortlist matches the budget, must-haves, and commute constraints.
  - **Edit Correctness Eval:** Verifies that voice edits target the right properties without collateral changes.
  - **Grounding & Hallucination Eval:** Cross-checks listings against the database to ensure availability, and verifies that neighborhood claims cite the RAG sources without hallucinations.

## Data Flow (Typical User Interaction)
1. **User Speaks:** "I'm looking for a 2BHK in Koramangala under 35k."
2. **Frontend:** Transcribes speech to text and sends it to the Backend.
3. **Backend Agent:** 
   - LLM extracts the intent (`location: Koramangala, budget: <=35000, type: 2BHK`).
   - Queries the **Property Database** for matching available listings.
   - For top matches, calls the **OpenStreetMap MCP** for nearby transit/amenities.
   - Queries the **Vector DB (RAG)** for neighborhood safety/character notes.
4. **Backend Agent:** Formats a response with the shortlist, citations, and justifications.
5. **Frontend:** Displays updated property cards, neighborhood panels, and sources.
