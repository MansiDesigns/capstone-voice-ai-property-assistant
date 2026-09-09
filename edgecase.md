# Edge Cases and Handling Strategy

This document outlines potential edge cases for the Voice-Based AI Property Assistant and the proposed strategies to handle them, based on the system's architecture and requirements.

## 1. Voice Input & Speech-to-Text (STT) Edge Cases

| Edge Case | Description | Handling Strategy |
| :--- | :--- | :--- |
| **Ambiguous or Unintelligible Audio** | Background noise, thick accents, or mumbled speech leading to poor transcription. | If STT confidence is too low or intent cannot be extracted, the agent should politely ask the user to repeat. |
| **Conflicting Constraints in One Breath** | User says: "I want a 2BHK under 30k but also I'm willing to pay 40k for a 3BHK." | The LLM must extract the primary intent and use one of its "5 clarifying questions" to explicitly ask the user to confirm the actual budget/size. |
| **Silent Input** | User activates the microphone but doesn't speak. | Timeout the STT after a few seconds of silence and prompt the user: "I didn't catch that. Are you still looking for properties?" |

## 2. Conversation & Orchestration Edge Cases

| Edge Case | Description | Handling Strategy |
| :--- | :--- | :--- |
| **Overly Restrictive Constraints** | User asks for a "3BHK in Indiranagar under 10k" (unrealistic for the market), resulting in 0 matches. | The system must gracefully inform the user that no such properties exist in the scraped dataset and suggest relaxing specific constraints (e.g., increasing budget or changing the area). |
| **Exceeding the Clarifying Question Limit** | The agent hits the max 5 questions limit without having enough information to build a reliable shortlist. | Fallback to a "Best Effort" shortlist based on whatever partial constraints were gathered, explicitly stating: "I've put together a few options based on what we've discussed so far..." |
| **Out-of-Domain Requests** | User asks the agent to "write a poem" or "book a flight." | The LLM system prompt must instruct the agent to refuse out-of-domain tasks and steer the conversation back to property hunting in Bengaluru. |

## 3. Data & RAG Edge Cases

| Edge Case | Description | Handling Strategy |
| :--- | :--- | :--- |
| **Missing Neighborhood Data** | RAG Vector DB has no safety or character notes for a specific obscure neighborhood. | **Strict Rule:** The system must explicitly state the uncertainty (e.g., "I don't have enough verified information about the safety of this specific street.") rather than hallucinating generic advice. |
| **BGE Embedding Limits** | The text chunk exceeds the BGE model's token limit during embedding generation. | Ensure proper text chunking strategies (e.g., LangChain's RecursiveCharacterTextSplitter) with appropriate overlap are used before passing data to the BGE model. |
| **OpenStreetMap MCP Failure / No Data** | The MCP server times out or returns zero amenities/transit points for a coordinate. | State the lack of data to the user: "I couldn't verify nearby transit points for this listing at the moment." Do not guess based on LLM pre-training. |
| **Hidden PII in Scraped Data** | Scraped listings from `bengaluru.rent` occasionally contain PII (phone numbers) in the free-text description field. | Ensure the backend cleaning pipeline uses regex and LLM-based PII detection to scrub free-text fields *before* they are loaded into the DB or presented to the UI. |

## 4. Shortlist Refinement Edge Cases

| Edge Case | Description | Handling Strategy |
| :--- | :--- | :--- |
| **Empty Result on Refinement** | User says "Only show me pet-friendly ones," but none of the current shortlist are pet-friendly. | Inform the user the refinement resulted in zero matches. Offer to expand the initial search query to find new pet-friendly options outside the current shortlist. |
| **Redundant Edits (No-Op)** | User says "Drop places above 50k," but the entire shortlist is already under 40k. | The system should acknowledge the command and confirm that all current options already meet this criteria, leaving the shortlist unchanged. |
| **Vague Refinement Commands** | User says "Show me better ones" or "I don't like these." | Ask a clarifying question to understand *why* they don't like them (e.g., "Are you looking for something cheaper, closer to work, or in a different area?"). |

## 5. Integration & Workflow Edge Cases

| Edge Case | Description | Handling Strategy |
| :--- | :--- | :--- |
| **n8n Webhook Failure** | The backend successfully triggers the n8n webhook, but n8n fails to generate the PDF or send the email. | The orchestration layer should wrap the webhook call in a try/catch. If it fails, inform the user: "I couldn't send the email right now, but your shortlist is saved here on the screen." |
| **Site Visit Booking Conflicts** | User tries to book a site visit for a listing that was just marked "Not for rent" in the backend database. | Before confirming the booking code, the backend must do a final real-time check of the property's availability status. If unavailable, apologize and ask them to pick another option. |

## 6. Evaluation Framework Edge Cases

| Edge Case | Description | Handling Strategy |
| :--- | :--- | :--- |
| **Eval Hallucination** | LLM-assisted evals (e.g., Grounding Eval) hallucinate a "Pass" for a claim that lacks a citation. | Use strict prompt engineering for the Eval LLM, requiring it to output the exact RAG citation string before outputting a PASS/FAIL boolean. |
