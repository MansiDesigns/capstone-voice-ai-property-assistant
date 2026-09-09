# Implementation Plan: Voice-Based AI Property Assistant

This document outlines the step-by-step implementation plan for building the Voice-Based AI Property Assistant, based on the `architecture.md` and `context.md`.

## Phase 1: Project Setup & Infrastructure
**Goal:** Initialize the monorepo, set up the backend and frontend skeletons, and configure version control.

1. **Repository Setup:**
   - Initialize a Git repository.
   - Create directories: `/frontend`, `/backend`, `/evals`, `/data`, `/docs`.
2. **Environment Configuration:**
   - Set up `.env` files for API keys (LLM Provider, Speech-to-Text API, DB credentials).
3. **Database Initialization:**
   - Spin up a local relational database (e.g., PostgreSQL or SQLite) for property listings.
   - Spin up a local Vector Database (e.g., ChromaDB) for RAG.

## Phase 2: Data Acquisition & Preparation
**Goal:** Gather and clean the necessary data for properties and neighborhoods.

1. **Property Listings (Structured Data):**
   - Scrape or acquire data from `bengaluru.rent`.
   - **Filter:** Remove any pins explicitly marked "Not for rent" to ensure only currently available listings are used.
   - **Sanitize:** Strip all PII (names, phone numbers).
   - **Load:** Insert the cleaned, structured data into the relational database.
2. **Neighborhood Data (Unstructured Data for RAG):**
   - Extract data from [https://bengaluru.rent/](https://bengaluru.rent/) for practical neighborhood guidance (safety, character, transit) to use as the RAG source.
   - Chunk the text and generate vector embeddings using the BGE model.
   - **Load:** Insert the embeddings and metadata (exact source citations/URLs) into the Vector Database.

## Phase 3: Backend Orchestration Layer
**Goal:** Build the core logic, LLM integrations, and tool calling.

1. **Backend Server Setup:**
   - Create the API server using FastAPI (Python) or Express (Node.js).
2. **LLM Orchestration & State Management:**
   - Integrate the Groq API for the LLM using function calling to ensure fast response times for voice.
   - Implement a conversation state manager to track user constraints (budget, bedrooms, must-haves).
   - Enforce the rule of asking a maximum of 5 clarifying questions.
3. **Tool Implementation:**
   - **Database Query Tool:** Function for the LLM to search the relational database based on the extracted constraints.
   - **RAG Query Tool:** Function to query the Vector DB for neighborhood information and return factual context + citations.
   - **MCP Client:** Integrate the OpenStreetMap MCP from [https://github.com/jagan-shanmugam/open-streetmap-mcp](https://github.com/jagan-shanmugam/open-streetmap-mcp) to dynamically fetch nearby amenities, transit points, and POI data around a listing's location.
4. **n8n Workflow Integration:**
   - Set up the n8n workflow to receive a JSON payload of the finalized shortlist, convert it to a PDF, and email it.
   - Add a tool in the orchestration layer to trigger this n8n webhook upon user voice confirmation.

## Phase 4: Frontend Development (Companion UI)
**Goal:** Build the minimal, user-facing web interface.

1. **UI Scaffold:**
   - Create a React or Next.js application.
   - Implement a clean design for the dashboard.
2. **Voice Integration:**
   - Implement the Web Speech API for the microphone button.
   - Display a live, real-time transcript of the user's speech.
3. **Property Components:**
   - Build **Shortlist Cards** displaying rent, bedrooms, area, and key amenities.
   - Build the **Neighborhood Snapshot Panel** detailing transit, safety notes, and nearby amenities.
4. **Context & Feedback Components:**
   - Build the **"Sources" / "References" section** to display the RAG citations explicitly.
   - Build the **Visit-Confirmation Panel** to show booking details (slot and confirmation code) upon voice confirmation.
5. **State Syncing:**
   - Ensure the UI seamlessly updates as the backend returns new or refined shortlists based on voice edits (e.g., "Drop anything above 40k").

## Phase 5: Evaluation Framework (Evals)
**Goal:** Develop the offline evaluation scripts to test system accuracy and constraints.

1. **Test Data Generation:**
   - Create sample test transcripts simulating various user flows (initial request, refinements, missing data scenarios).
2. **Evaluation Scripts (Python):**
   - **Feasibility Eval:** Script to verify the output shortlist strictly matches the extracted budget and must-haves, and validates commute consistency.
   - **Edit Correctness Eval:** Script to verify that voice edits correctly filter the existing list without altering unaffected properties.
   - **Grounding & Hallucination Eval:** Script to verify all listed properties exist in the database (as available) and all neighborhood claims are backed by specific RAG citations.

## Phase 6: Integration, Testing & Final Delivery
**Goal:** Bring everything together, test thoroughly, record the demo, and finalize the repository.

1. **End-to-End Testing:**
   - Test the complete flow: voice input -> backend processing -> MCP tool usage -> RAG queries -> UI update -> n8n email generation.
2. **Demo Recording:**
   - Record the 5-minute demo video covering all required deliverables:
     - Voice-based preference collection.
     - Voice-based shortlist edit.
     - Explanation ("why this one?").
     - Sources view.
     - At least one eval running.
     - Demonstration of the MCP call.
3. **Deployment:**
   - Deploy the frontend (e.g., to Vercel/Netlify).
   - Deploy the backend and databases (e.g., to Render/Heroku/AWS).
   - Verify the application is accessible via a public URL.
4. **Documentation:**
   - Finalize the `README.md` with architecture diagrams, setup instructions, MCP integration details, data collection notes, and evaluation instructions.
