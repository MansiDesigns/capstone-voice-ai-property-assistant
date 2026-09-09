# Voice-Based AI Property Assistant

## Project Overview
A deployed voice-based AI assistant with a minimal companion UI to help users find rental properties in Bengaluru. The assistant helps users collect preferences, shortlists real properties, grounds claims in public sources, allows voice refinements, explains its choices, and can trigger site-visit bookings and email compilations.

## Core Capabilities
1. **Voice-Based Preference Collection:** Conversational input for budget, bedrooms, must-haves, commute, etc. Max 5 clarifying questions. Confirm constraints before generating shortlist.
2. **Voice-Based Shortlist Refinement:** Modify existing shortlists via voice commands (e.g., "Drop anything above 40k"). Only affected parts of the shortlist should change.
3. **Explanation & Reasoning:** Provide grounded explanations for why properties were selected or dropped, including commute and neighborhood details.
4. **Site-Visit Booking:** Voice command to book a site-visit slot once the user has a liked shortlist.
5. **n8n Workflow Integration:** Compile the shortlist into a PDF and email it to the user.

## Companion UI Requirements
- **Shortlist cards** showing rent, bedrooms, area, and key amenities.
- **Neighborhood snapshot panel** for each listing (transit, safety notes, amenities).
- **Microphone button** and live transcript.
- **"Sources" or "References" section** for neighborhood claims.
- **Visit-confirmation panel** displaying booking slot and confirmation code.

## Data & External Integrations
- **Property Listings:** Gathered from [bengaluru.rent](https://bengaluru.rent/). **Rule:** Only currently available listings (exclude "Not for rent" transparency pins).
- **Data Privacy:** Remove all PII (names, phone numbers) before data touches the dataset, UI, or logs.
- **OpenStreetMap MCP:** Use the OpenStreetMap MCP repo ([https://github.com/jagan-shanmugam/open-streetmap-mcp](https://github.com/jagan-shanmugam/open-streetmap-mcp)) for nearby amenities, transit points, and POI data around a listing's location.
- **Neighborhood Data (RAG):** RAG must be used for neighborhood practical guidance (safety, character, etc.) grounded in data extracted from [https://bengaluru.rent/](https://bengaluru.rent/) with citations shown in the UI. No hallucinated claims. Vector embeddings for RAG must be generated using the BGE model.
- **Uncertainty:** If listing, amenity, or neighborhood data is missing or unreliable, the system must say so, not guess.

## AI Evaluations (Evals)
At least three runnable evaluations (rule-based or LLM-assisted):
1. **Feasibility Eval:** Shortlist respects stated budget and must-haves. Commute claims are internally consistent with the stated commute point.
2. **Edit Correctness Eval:** Voice edits only modify intended parts of the shortlist. No unintended changes elsewhere.
3. **Grounding & Hallucination Eval:** Listings map to dataset records and are marked as currently available. Neighborhood claims cite RAG sources. Uncertainty is explicitly stated when neighborhood data is missing.

## Tech & Deployment Requirements
- Built using the Groq API for LLM orchestration.
- Voice input (Speech-to-Text).
- Version control using Git.
- Deployed prototype with a public URL.

## Deliverables
1. **Deployed application link.**
2. **5-minute demo video showing:**
   - Voice-based preference collection.
   - Voice-based shortlist edit.
   - Explanation ("why this one?").
   - Sources view.
   - At least one eval running.
   - Clear demonstration of the required MCP call.
3. **Git repository containing:**
   - README (architecture + setup).
   - How you integrated MCP.
   - Scraped dataset and how it was collected/cleaned.
   - How to run evals.
   - Sample test transcripts.
