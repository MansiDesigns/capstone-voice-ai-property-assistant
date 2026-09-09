# Deployment Plan: Voice-Based AI Property Assistant

## 1. Overview
This deployment plan outlines the architecture and steps required to deploy the Voice-Based AI Property Assistant to a public URL. It covers the frontend companion UI, the backend orchestration API, the databases (relational and vector), and the n8n webhook workflow.

## 2. Infrastructure Architecture

### Frontend (Companion UI)
- **Hosting Platform:** Vercel or Netlify.
- **Why:** Optimized for React/Next.js, offers continuous deployment via Git integration, automatic HTTPS, and fast global edge networks.

### Backend (Orchestration API)
- **Hosting Platform:** Render or Railway.
- **Why:** Simple deployment from GitHub, supports Docker or native Python/Node.js environments, suitable for the FastAPI/Express.js backend, and provides straightforward environment variable management.

### Databases
- **Relational DB (Properties):** Supabase (Managed PostgreSQL) or Render Managed PostgreSQL.
- **Vector DB (RAG):** Pinecone (Serverless) or Weaviate Cloud.
- **Why:** Managed services reduce operational overhead, provide easy connection strings, and simplify scaling for a prototype.

### Third-Party & External Services
- **LLM API:** Groq API (fast inference for voice).
- **Automation (n8n):** n8n Cloud or self-hosted on a basic VPS (e.g., DigitalOcean Droplet) for the PDF generation and email workflow.
- **MCP Server:** OpenStreetMap MCP (Can be deployed as a background service or Docker container alongside the backend).

## 3. Pre-Deployment Checklist
- [ ] Ensure all environment variables (API keys, DB URIs) are documented and secured.
- [ ] Confirm all PII has been stripped from the property dataset.
- [ ] Ensure only "currently available" listings are present in the production database (no "Not for rent" pins).
- [ ] Verify that neighborhood embeddings (BGE model) are successfully generated and loaded.
- [ ] Run and pass all offline evaluations (Feasibility, Edit Correctness, Grounding).
- [ ] Ensure `README.md` is updated with architecture, setup, and deployment instructions.

## 4. Deployment Steps

### Step 1: Database Provisioning & Seeding
1. Provision the managed PostgreSQL instance.
2. Run database migrations to create the required schema.
3. Load the cleaned, PII-free property dataset into the relational database.
4. Provision the Vector Database instance.
5. Ingest the generated BGE embeddings for neighborhood data (with proper citations as metadata) into the Vector DB.

### Step 2: Automation Workflow (n8n)
1. Set up an n8n instance (Cloud or self-hosted).
2. Import the PDF generation and email workflow.
3. Generate the public webhook URL for the workflow.
4. Test the webhook using a mock finalized shortlist JSON payload to ensure the PDF is generated and emailed correctly.

### Step 3: Backend Deployment
1. Configure environment variables in the hosting provider (Render/Railway):
   - `DATABASE_URL`
   - `VECTOR_DB_URL` / `VECTOR_DB_API_KEY`
   - `GROQ_API_KEY`
   - `N8N_WEBHOOK_URL`
2. Deploy the FastAPI/Express application.
3. Deploy the OpenStreetMap MCP server. If deploying via Docker, configure it to run alongside the main backend and expose its standard I/O or HTTP interface.
4. Verify backend health check endpoints and connectivity to databases and the MCP server.

### Step 4: Frontend Deployment
1. In Vercel/Netlify, connect the Git repository and set the root directory to `/frontend`.
2. Configure frontend environment variables, primarily the deployed Backend API URL (e.g., `NEXT_PUBLIC_API_URL`).
3. Deploy the frontend application.
4. Verify the application is accessible via the generated public URL.

## 5. Post-Deployment Verification
Perform an end-to-end test on the deployed public URL:
1. **Voice Input:** Use the microphone to record preferences and ensure accurate speech-to-text.
2. **Shortlist Generation:** Verify the shortlist populates correctly based on constraints.
3. **Shortlist Editing:** Test voice commands to modify the shortlist.
4. **Explanations & Grounding:** Ask for property explanations and verify that RAG citations are displayed correctly in the UI.
5. **Workflow Trigger:** Confirm the shortlist and ensure the n8n webhook triggers the PDF email successfully.
6. **Data Privacy:** Do a final check to ensure absolutely no PII is visible in the UI or network logs.

## 6. Continuous Integration / Continuous Deployment (CI/CD)
- Set up GitHub Actions to automatically run the evaluation scripts (Feasibility, Edit Correctness, Grounding) on Pull Requests to the `main` branch.
- Configure auto-deployments on Vercel and Render for the `main` branch, conditional upon passing the CI evaluations.
