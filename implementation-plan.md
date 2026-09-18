# Implementation Plan: AI-Powered Discovery Engine

This document outlines the phase-wise implementation plan for the **AI-Powered Discovery Engine for Vague Photo Retrieval**, adhering to the architecture and problem statement definitions. The development is divided into 7 distinct phases, building from foundational data systems up to the frontend user interface.

## Phase 1: Environment Setup & Foundation (Weeks 1-2)
**Goal:** Establish the core infrastructure, database schemas, and external API connections.
*   **Tasks:**
    *   Initialize the backend repository (Python/FastAPI) and frontend repository (React/Next.js or Vite).
    *   Set up the databases: 
        *   Relational DB (PostgreSQL) for structured metadata and raw text.
        *   Vector DB (e.g., Qdrant, Weaviate, or pgvector) for semantic embeddings.
    *   Integrate API keys and setup clients for:
        *   **LLM Provider**: Groq (`llama-3.3-70b-versatile`).
        *   **Embeddings**: `BAAI/bge-large-en-v1.5` (via local hosting with Hugging Face/SentenceTransformers or a dedicated endpoint).
    *   Define core data models and database schemas (e.g., `FeedbackRecord`, `ProcessedInsight`).

## Phase 2: Data Ingestion Pipeline (Weeks 2-3)
**Goal:** Build the system to scrape, collect, and normalize public discourse data.
*   **Tasks:**
    *   Develop web scrapers/API clients for target sources (Reddit, App Store reviews, Support Forums).
    *   Implement filtering logic to isolate photo retrieval, memory, and search-related conversations.
    *   Create a text normalization and cleaning pipeline (removing PII, standardizing formatting).
    *   Automate ingestion via scheduling (e.g., Airflow, cron jobs) to continuously populate the raw database.

## Phase 3: Data Processing & Vectorization (Weeks 3-4)
**Goal:** Extract structured features from raw text and generate semantic embeddings for search.
*   **Tasks:**
    *   Implement an LLM extraction pipeline using Groq (`llama-3.3-70b-versatile`) to parse raw text and identify:
        *   Target of search (e.g., receipt, vacation).
        *   Search strategy used.
        *   User emotion/frustration.
    *   Generate embeddings for the text chunks using `BAAI/bge-large-en-v1.5`.
    *   Upsert the generated embeddings into the Vector Database alongside the extracted structured metadata (stored in Postgres).

## Phase 4: Intent Inference & Backend RAG Engine (Weeks 5-6)
**Goal:** Develop the core retrieval logic and intent classification API.
*   **Tasks:**
    *   Build the `POST /api/query` endpoint in FastAPI.
    *   Implement the Intent Inference module using Groq to classify incoming natural language queries (e.g., Cognitive Memory, Search Breakdown).
    *   Develop the Retrieval-Augmented Generation (RAG) logic:
        *   Translate the inferred intent into a Vector DB query (embedding the user query with `bge-large-en-v1.5`).
        *   Perform a hybrid search (semantic similarity + metadata filtering) to fetch relevant feedback threads.

## Phase 5: Synthesis & Quantification Engine (Weeks 6-7)
**Goal:** Transform retrieved raw feedback into structured, actionable insights.
*   **Tasks:**
    *   Design the LLM prompt chain (using Groq) for analyzing the retrieved context.
    *   Implement logic to calculate proportional metrics from the structured metadata (e.g., Failure distribution, root cause percentages).
    *   Configure the LLM to output a structured JSON response containing:
        *   Synthesized qualitative insights.
        *   Categorized retrieval problems.
        *   Direct supporting quotes from users.

## Phase 6: Frontend Dashboard Development (Weeks 7-8)
**Goal:** Build the user interface for internal product teams to query and view insights.
*   **Tasks:**
    *   Develop the main Search UI for accepting natural language inquiries.
    *   Integrate React charting libraries (e.g., Recharts) to build Metrics Cards and Visualizations (Failure distributions, root causes).
    *   Build the Insights Panel and Evidence Feed to display the AI-generated analysis and raw user quotes.
    *   Connect the frontend components to the FastAPI endpoints.

## Phase 7: Testing, Optimization, and Deployment (Week 9)
**Goal:** Ensure system stability, optimize latency, and deploy to production.
*   **Tasks:**
    *   Conduct end-to-end testing of the query pipeline to ensure high relevance of RAG retrieval.
    *   Optimize LLM response times (leveraging Groq's fast inference speeds) and refine prompt structures for accuracy.
    *   Containerize the application using Docker.
    *   Deploy the backend, frontend, and databases to the target cloud infrastructure (e.g., AWS, GCP, Vercel/Render).
