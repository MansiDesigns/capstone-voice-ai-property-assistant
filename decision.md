# Architectural Decision Records (ADR)

This document captures the key architectural, design, and strategic decisions made for the Voice-Based AI Property Assistant based on the project requirements.

## 1. LLM Orchestration
- **Decision:** Use the Groq API for LLM orchestration and function calling.
- **Rationale:** Groq provides exceptionally fast inference speeds, which is critical for maintaining a natural, low-latency conversational flow when processing real-time voice inputs and text generation.

## 2. Embedding Model for RAG
- **Decision:** Use the BGE model (BAAI General Embedding) for generating vector embeddings.
- **Rationale:** The BGE model offers strong performance for retrieval-augmented generation (RAG) tasks, ensuring high-quality semantic matching when querying unstructured neighborhood safety, character, and transit data.

## 3. Separation of Spatial Data and Subjective Data
- **Decision:** Use the OpenStreetMap MCP for factual spatial data (amenities, transit points) and RAG for subjective neighborhood guidance.
- **Rationale:** Hard facts like exact amenity locations should not rely on static LLM pre-training or text chunks. OpenStreetMap provides deterministic spatial data. Conversely, RAG is perfectly suited for unstructured qualitative text (e.g., neighborhood "vibe" or safety reviews extracted from `bengaluru.rent`).

## 4. Conversation State Constraints
- **Decision:** Enforce a strict limit of 5 clarifying questions for the AI agent.
- **Rationale:** Prevents the agent from trapping the user in an infinite loop of questions. If the agent cannot finalize constraints within 5 questions, it must gracefully fallback to a "best effort" shortlist based on whatever partial constraints were gathered.

## 5. Data Privacy and Listing Availability
- **Decision:** Strip all PII (names, phone numbers) before data enters the database, and strictly filter out properties marked "Not for rent".
- **Rationale:** Ensures strict compliance with data privacy standards. Filtering unavailable properties prevents the AI from generating invalid shortlists, ensuring site-visit bookings are feasible.

## 6. Strict Uncertainty Handling
- **Decision:** The system must explicitly state uncertainty when data is missing, rather than guessing.
- **Rationale:** Hallucinated safety data or non-existent transit options severely degrade user trust. It is much better for the AI to state "I don't have verified information about this" than to hallucinate a response.

## 7. Workflow Automation
- **Decision:** Use an n8n webhook integration for PDF compilation and email delivery.
- **Rationale:** Offloads the asynchronous, heavy lifting of document generation and email dispatching from the core orchestration backend, keeping the primary server lightweight and focused on real-time interaction.
