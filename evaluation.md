# Evaluation Framework: Voice-Based AI Property Assistant

This document outlines the evaluation strategy for the Voice-Based AI Property Assistant, detailing how the system's accuracy, constraints, and hallucination resistance will be tested based on the project requirements.

## 1. Overview
The evaluation framework is an offline suite designed to test the core capabilities of the orchestration layer and its tools. It ensures the assistant adheres to user constraints, avoids hallucination, and properly interacts with external data sources.

- **Tech Stack:** Python scripts (rule-based or LLM-assisted using frameworks like LangSmith or promptfoo).
- **Goal:** Develop robust scripts to test system accuracy and constraints against pre-defined transcripts.

## 2. Test Data Generation
To run the evaluations, a comprehensive dataset of sample test transcripts must be created. This dataset will simulate various user interaction flows:
- **Initial Requests:** Gathering basic budget, size, and area preferences.
- **Refinements:** Simulating voice edits (e.g., "Drop anything above 40k").
- **Missing Data Scenarios:** Testing the system's response when neighborhood data or MCP data is unavailable.

## 3. Core Evaluations
The framework will consist of at least three runnable evaluations:

### A. Feasibility Eval
**Purpose:** Ensure the generated shortlist respects stated constraints and commute claims are consistent.
- **Metrics/Checks:** 
  - Does the output shortlist strictly match the extracted budget and must-haves?
  - Are commute claims internally consistent with the stated commute point?
- **Type:** Rule-based / LLM-assisted.

### B. Edit Correctness Eval
**Purpose:** Verify that voice edits correctly modify existing shortlists without unintended side effects.
- **Metrics/Checks:**
  - Do voice edits target and filter only the intended properties?
  - Are unaffected properties left intact without collateral changes?
- **Type:** Rule-based / Structural comparison.

### C. Grounding & Hallucination Eval
**Purpose:** Ensure listings are available and neighborhood claims are backed by citations, without hallucinations.
- **Metrics/Checks:**
  - Do all listed properties map to actual dataset records?
  - Are listed properties marked as currently available?
  - Do all neighborhood claims cite specific RAG sources?
  - Is uncertainty explicitly stated when neighborhood or MCP data is missing?
- **Type:** LLM-assisted / Rule-based cross-referencing.

## 4. Handling Evaluation Edge Cases

### Evaluation Hallucination
When using LLMs to assist in evaluations (e.g., the Grounding Eval), there is a risk that the Eval LLM itself might hallucinate a "Pass" for a claim that lacks a proper citation.
- **Handling Strategy:** Use strict prompt engineering for the Eval LLM. It must be required to output the exact RAG citation string *before* outputting a final PASS/FAIL boolean.
