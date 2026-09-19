<div align="center">
  
# 🌌 DealFlow AI 
**Real Gemini-Powered Agentic Sales & Alliances Platform**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Gemini AI](https://img.shields.io/badge/Gemini_2.5_Flash-8E75FF?style=for-the-badge&logo=google&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)

An enterprise multi-agent sales platform driven by a secure, server-side Gemini AI gateway with structured outputs, grounded RAG retrieval, human approval governance, and automatic fallback.

[**Explore Demo Guide**](docs/demo-guide.md) • [**View Architecture**](docs/architecture.md) • [**API Contracts**](docs/api-contracts.md)

</div>

---

## ⚡ What is DealFlow AI?

DealFlow AI transforms messy business inquiries (like emails, raw meeting notes, or RFP fragments) into a fully structured, qualified deal pipeline using **5 Orchestrated Autonomous AI Agents**.

Built for the **AIONOS Demonstration**, this system integrates real **Google Gemini API** calls over a secure server gateway while providing a seamless **Demo Mode** fallback when credentials are not supplied.

### 🎭 The 5 Autonomous AI Agents

1. **🕵️ Intake Agent**: Ingests unstructured inquiries, extracting categorized technical/business requirements, criticality ratings, missing parameters, and operational risks.
2. **⚖️ Qualification Agent**: Scores strategic fit and feasibility (labeled as a *Demo-generated estimate*), highlighting key strengths, risks, and prospect follow-up questions.
3. **🔗 Capability Matcher (RAG)**: Grounded in internal knowledge base documents. Matches requirements to firm solutions and SMEs while citing source document IDs (`[doc-1]`, `[doc-3]`).
4. **📝 Proposal Drafter**: Synthesizes client needs and matched evidence into a multi-section proposal draft.
5. **🤖 Follow-up Planner**: Generates an actionable task backlog with assigned Human vs. AI owners, priorities, and suggested due dates.
6. **🛡️ Human Approval Gate**: Mandatory governance layer requiring executive review and sign-off before proposals are finalized.

---

## 🔒 Security Architecture

- **Zero Client Key Exposure**: `GEMINI_API_KEY` is strictly managed by the server API layer (`server/`). It is never bundled into client JS code or exposed in network payloads.
- **Dual Engine Modes**:
  - **🟢 Live Gemini AI Mode**: Active when `GEMINI_API_KEY` is set in `.env`. Calls `@google/genai` with strict `responseSchema` validation.
  - **🟡 Demo Mode**: Automatic local deterministic fallback if no API key is present or if API rate limits occur. Visible mode badge in UI.

---

## 🚀 Quick Start

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/heyayushhh/AIONOS-AI-AGENT.git
cd AIONOS-AI-AGENT

# Install dependencies
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
To run in **Live AI Mode**, set your Gemini API key in `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
AI_MODE=live
```
*(If left blank or set to `AI_MODE=demo`, the application will automatically run in Demo Mode with deterministic local mock data).*

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 📖 Running the Demo Walkthrough

1. Click **Open Workspace** on the landing page.
2. Click **+ New Opportunity** in the sidebar.
3. Click **Load Demo Inquiry** to load the AWS cloud modernization scenario.
4. Click **Analyze Opportunity**.
5. Click **Run Agent Workflow** and watch the 5 agents execute sequentially on the timeline.
6. Review extracted requirements, capability matches with cited document IDs (`[doc-1]`, `[doc-3]`), and the generated proposal draft.
7. Click **Approve Proposal** in the Proposal tab to complete the Human Approval Gate.

> See [`docs/demo-guide.md`](docs/demo-guide.md) for full step-by-step instructions.

---

## 🏗️ Technical Documentation

All detailed technical documentation is located in `docs/`:
- [`Architecture`](docs/architecture.md) - System architecture and server gateway design.
- [`Agent Workflow`](docs/agent-workflow.md) - Pipeline breakdown for all 5 specialized agents.
- [`Prompt Engineering`](docs/prompt-engineering.md) - System instructions, schemas, and injection protection.
- [`RAG Design`](docs/rag-design.md) - Keyword retrieval implementation and document citation tracking.
- [`API Contracts`](docs/api-contracts.md) - Complete REST API specification.
- [`Demo Guide`](docs/demo-guide.md) - Execution guide for Live vs Demo modes.
- [`Future Roadmap`](docs/future-production-roadmap.md) - Path to production with LangGraph, Pinecone, and PostgreSQL.
- [`Database Design`](docs/database-design.md) - PostgreSQL schema design for enterprise persistence.

---
<div align="center">
  <i>Built with precision for the AIONOS demonstration.</i>
</div>
