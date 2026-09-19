<div align="center">

# 🌌 DealFlow AI
### *The Autonomous Agentic Sales & Alliances Platform*

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Gemini 3.6 Flash](https://img.shields.io/badge/Gemini_3.6_Flash-8E75FF?style=for-the-badge&logo=google&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
[![Vercel Ready](https://img.shields.io/badge/Vercel_Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)](#)

A state-of-the-art enterprise sales orchestration platform built for **AIONOS**, powered by a secure server-side **Google Gemini AI Gateway**, structured JSON output validation, grounded Retrieval-Augmented Generation (RAG), and Executive Human-in-the-Loop governance.

[**Quick Start Guide**](#-quick-start--setup-guide) • [**Why AIONOS Needs DealFlow AI**](#-why-aionos-needs-dealflow-ai) • [**System Architecture**](docs/architecture.md) • [**API Contracts**](docs/api-contracts.md)

</div>

---

## 💡 Why AIONOS Needs DealFlow AI

In enterprise sales, strategic alliances, and cloud consulting, companies lose millions of dollars due to manual friction:
- **Unstructured Inquiries**: Incoming RFPs, executive emails, and raw meeting notes take days or weeks for business development representatives to manually digest.
- **Disconnected SME Knowledge**: Account executives struggle to quickly identify internal Subject Matter Experts (SMEs) and firm capabilities that match client requirements.
- **Ungrounded & Delayed Proposals**: Drafting customized proposals takes weeks, often resulting in generic text lacking verifiable proof points.
- **Lack of Governance**: Uncontrolled AI automation risks sending hallucinatory or unverified commitments to prospective enterprise clients.

### 🎯 The Solution: DealFlow AI
DealFlow AI converts raw business inquiries into qualified opportunities, grounded capability matches, and client-ready proposal drafts **in under 60 seconds**. 

Built specifically for enterprise environments:
- **Zero API Key Leakage**: Uses a secure server-side API Gateway (`server.ts`) protecting secret credentials from client bundles.
- **Dual-Mode Engine**: Operates in **🟢 Live Gemini AI Mode** when an API key is present, and seamlessly falls back to **🟡 Demo Mode** when unconfigured.
- **Strict Human Approval Gate**: Guarantees AI never makes external commitments or transmits proposals without explicit executive sign-off.

---

## 🎭 What We Have Built: The 5 Autonomous AI Agents

DealFlow AI operates a coordinated multi-agent pipeline:

```
┌─────────────────┐     ┌──────────────────────┐     ┌────────────────────────────┐
│ 01 Intake Agent ├────►│ 02 Qualification     ├────►│ 03 Capability Matcher (RAG)│
│ (Requirement    │     │    Agent             │     │ (Grounded In Docs & SMEs)  │
│  Extraction)    │     │ (Strategic Fit Score)│     └─────────────┬──────────────┘
└─────────────────┘     └──────────────────────┘                   │
                                                                   ▼
┌─────────────────────────┐     ┌──────────────────────┐     ┌────────────────────────────┐
│ 🛡️ Human Approval Gate  │◄────┤ 05 Follow-up Planner │◄────┤ 04 Proposal Drafter        │
│ (Executive Sign-off)    │     │    Agent             │     │    Agent                   │
└─────────────────────────┘     └──────────────────────┘     └────────────────────────────┘
```

### 1. 🕵️ Intake Agent (`/api/ai/intake`)
- **Role**: Technical Requirement Analyst
- **Function**: Parses raw unstructured text, RFPs, or emails.
- **Output**: Categorized requirements (**Technical**, **Business**, **Compliance**), criticality ratings (**High/Medium/Low**), vague missing parameters, and technical risks.
- **Security**: Hardened against prompt injection by treating client inquiries strictly as untrusted data.

### 2. ⚖️ Qualification Agent (`/api/ai/qualification`)
- **Role**: Strategic Opportunity Assessor
- **Function**: Evaluates budget, timeline feasibility, and strategic fit.
- **Output**: Fit classification (`Qualified`, `Unqualified`, `Nurture`), numerical fit score (explicitly labeled as a *Demo-generated estimate*), strategic strengths, risks, and prospect follow-up questions.

### 3. 🔗 Capability Matcher & RAG Engine (`/api/ai/capabilities`)
- **Role**: Solution Architect & SME Grounding Specialist
- **Function**: Grounded in internal knowledge base documents (`doc-1`, `doc-2`, `doc-3`, `doc-4`).
- **Output**: Matched firm capabilities, relevance explanations, Subject Matter Experts (SMEs), and cited source document IDs (`[doc-1]`, `[doc-3]`).

### 4. 📝 Proposal Drafter Agent (`/api/ai/proposal`)
- **Role**: Enterprise Proposal Architect
- **Function**: Synthesizes client requirements, qualification insights, and RAG evidence into a multi-section proposal.
- **Output**: Executive Summary, Client Needs, Solution Design, Implementation Phasing, Risks, and Open Questions with inline evidence citations.

### 5. 🤖 Follow-up Planner Agent (`/api/ai/follow-ups`)
- **Role**: Alliance Execution Orchestrator
- **Function**: Generates recommended next steps.
- **Output**: Actionable task backlog with assigned **Human** vs **AI** owners, priorities, and suggested due dates.

### 6. 🛡️ Human Approval Gate
- **Role**: Executive Governance
- **Function**: Blocks unverified proposal transmission. Requires explicit executive review and approval in the UI before proposal status is updated to `Approved`.

---

## ⚡ Quick Start & Setup Guide

### 1. Installation
Clone the repository and install node modules:
```bash
git clone https://github.com/heyayushhh/AIONOS-AI-AGENT.git
cd AIONOS-AI-AGENT
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` to configure your Gemini API key:
```env
# Server-side Gemini API key (Never exposed to frontend bundles)
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Supported model identifier
GEMINI_MODEL=gemini-3.6-flash

# Set to 'live' for real Gemini API calls, or 'demo' for local mock fallback
AI_MODE=live

# Server Port
PORT=3000
```

*(If `GEMINI_API_KEY` is left blank, DealFlow AI runs automatically in **Demo Mode** with local deterministic fallbacks).*

### 3. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎮 How to Operate DealFlow AI (Operator Guide)

```
 [1. Home / Landing Page] ──► Click "Open Workspace"
                                  │
 [2. Sales Dashboard] ──────► Click "+ New Opportunity"
                                  │
 [3. Opportunity Intake] ───► Click "Load Demo Inquiry" ──► Click "Analyze Opportunity"
                                  │
 [4. Opportunity Workspace] ─► Click "Run Agent Workflow"
                                  │
                                  ├─► Watch 5 Agents execute on timeline
                                  ├─► Review Extracted Requirements & RAG Evidence Docs
                                  └─► View Synthesized Proposal & Task Backlog
                                  │
 [5. Approval Gateway] ─────► Click "Approve Proposal" (Human-in-the-loop sign-off)
```

### Step 1: Accessing the Command Center
1. Navigate to `http://localhost:3000`.
2. Click **Open Workspace** in the top navigation bar.
3. Observe the **Sidebar Mode Indicator**:
   - 🟢 **Live Gemini AI Mode**: Real-time Gemini 3.6 Flash agent execution.
   - 🟡 **Demo Mode (Fallback)**: Local deterministic simulation.

### Step 2: Ingesting an Opportunity
1. Click **+ New Opportunity** in the sidebar.
2. Click **Load Demo Inquiry** (or paste custom email/RFP text).
   - *Example Scenario*: Global Retail Alliance AWS Cloud Modernization ($5M budget, Q3 timeline, 99.99% uptime goal).
3. Click **Analyze Opportunity**.

### Step 3: Running the Multi-Agent Pipeline
1. In the Opportunity Workspace, click **Run Agent Workflow**.
2. Watch the **Timeline Progress Bar** animate as each agent completes:
   - **01 Intake**: View extracted requirements categorized by criticality.
   - **02 Qualification**: View fit score and prospect follow-up questions.
   - **03 Capabilities**: View matched firm capabilities and cited source doc IDs (`[doc-1]`, `[doc-3]`).
   - **04 Proposal**: View generated executive summary and solution architecture sections.
   - **05 Follow-up Planner**: View human vs AI task assignments.

### Step 4: Executive Sign-off (Human-in-the-Loop)
1. Select the **Proposal** tab.
2. Review the synthesized sections and evidence references.
3. Click **Approve Proposal** to grant executive approval. The opportunity status updates to **Approved** across the workspace!

---

## 🚀 Deployment (Vercel)

DealFlow AI is configured for seamless deployment to **Vercel** with Express serverless routing:

1. Push your repository to GitHub (ensure `.env` is ignored).
2. Import the repository into **Vercel**.
3. In **Project Settings → Environment Variables**, set:
   - `GEMINI_API_KEY` = `your_gemini_api_key`
   - `GEMINI_MODEL` = `gemini-3.6-flash`
   - `AI_MODE` = `live`
4. Deploy! Vercel uses [`vercel.json`](vercel.json) to automatically route `/api/*` requests to serverless Express functions while serving the Vite React frontend.

---

## 🛠️ Tech Stack Architecture

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite | Glassmorphic, responsive command center UI |
| **Styling** | Tailwind CSS v4, Lucide Icons | Modern dark-navy aesthetic with dynamic micro-animations |
| **Server Gateway** | Node.js, Express, `dotenv` | Lightweight backend enforcing key security & API contracts |
| **AI Engine** | `@google/genai` (Gemini 3.6 Flash) | Structured JSON schema outputs with injection defenses |
| **RAG Retrieval** | Keyword & Tag Search Service | Illustrative document grounding with evidence citation tracking |
| **Governance** | Human Approval Gate | Executive sign-off interface before proposal finalization |
| **Deployment** | Vercel (`vercel.json`) | Serverless Express API & static SPA deployment |

---

## 📖 Complete Documentation Index

All detailed technical specifications are available in the [`docs/`](docs/) directory:
- 🏗️ [`Architecture & System Design`](docs/architecture.md) - Server gateway, security model, and dual-engine architecture.
- 🎭 [`Multi-Agent Workflow`](docs/agent-workflow.md) - Detailed breakdown of all 5 specialized agents.
- 🧠 [`Prompt Engineering`](docs/prompt-engineering.md) - System instructions, schemas, and injection protection rules.
- 📚 [`RAG Design`](docs/rag-design.md) - Grounded keyword retrieval implementation and citation tracking.
- 🔌 [`API Contracts`](docs/api-contracts.md) - Complete REST API specification (`/api/health`, `/api/ai/*`).
- 🎮 [`Demonstration Guide`](docs/demo-guide.md) - Full step-by-step walkthrough for Live vs Demo modes.
- 🗺️ [`Future Production Roadmap`](docs/future-production-roadmap.md) - Upgrade path to LangGraph, Pinecone vector search, and PostgreSQL.
- 🗄️ [`Database Schema Design`](docs/database-design.md) - PostgreSQL relational schema for enterprise deployment.

---

<div align="center">
  <i>Built with precision for the AIONOS demonstration.</i>
</div>
