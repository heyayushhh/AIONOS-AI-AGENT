<div align="center">
  
# 🌌 DealFlow AI 
**The Autonomous Agentic Sales & Alliances Platform**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)

A breathtaking, cinematic frontend demonstration showing how a multi-agent AI system can orchestrate the entire lifecycle of enterprise sales opportunities.

[**Explore the Walkthrough**](docs/demo-guide.md) • [**View Architecture**](docs/architecture.md)

</div>

---

## ⚡ What is DealFlow AI?

DealFlow AI transforms unstructured, messy business inquiries (like emails, raw meeting notes, or RFP fragments) into a fully structured, qualified deal pipeline using **Simulated Autonomous AI Agents**. 

Built for the **AIONOS Internship Demonstration**, this project replaces static dashboards with a dynamic, living workspace where specialized AI agents collaborate, match capabilities, and draft client-ready proposals.

### 🎭 The AI Agents (Simulated)

- **🕵️ Intake Agent**: Ingests unstructured text, extracting formal technical/business requirements, and flagging risks or missing information.
- **⚖️ Qualification Agent**: Scores the opportunity based on budget, timeline feasibility, and strategic fit.
- **🔗 Capability Matcher**: Semantically searches the internal Knowledge Base (simulating RAG) to match requirements to firm capabilities and Subject Matter Experts (SMEs).
- **📝 Proposal Drafter**: Synthesizes the matches and client needs into a multi-section, authoritative proposal draft.
- **🤖 Follow-up Planner**: Orchestrates next steps, assigning tasks to both humans and AI workers.

## ✨ Key Features

- **Cinematic UX**: A premium, dark-navy glassmorphic interface that feels like a command center.
- **Deterministic Simulation**: A completely local, mock service layer that deterministically mimics LLM latency and outputs without needing a backend or API keys.
- **Global State Management**: Context and LocalStorage powered pipeline that persists across your demo session.
- **Human-in-the-Loop (HITL)**: Built-in approval gateways requiring executive sign-off before AI actions are finalized.
- **Mobile Responsive**: Fully usable across desktop, tablet, and mobile devices with dedicated bottom navigation.

## 🚀 Getting Started

To run the demonstration locally:

```bash
# 1. Clone the repository
git clone https://github.com/heyayushhh/AIONOS-AI-AGENT.git
cd AIONOS-AI-AGENT

# 2. Install dependencies (npm, pnpm, or bun)
npm install

# 3. Start the development server
npm run dev
```

Open `http://localhost:3000` (or the port specified by Vite) in your browser.

## 📖 Running the Demo

1. Click **Go to Workspace** on the landing page.
2. Hit the **+ New Opportunity** button.
3. Click **Load Demo Inquiry** to auto-fill a realistic cloud modernization scenario.
4. Click **Analyze Opportunity**.
5. Inside the Opportunity Workspace, click **Run Analysis Workflow** and watch the agents work their magic!

> See `docs/demo-guide.md` for a complete step-by-step walkthrough.

## 🏗️ Architecture & Documentation

All technical documentation is located in the `docs/` folder:
- [`Architecture`](docs/architecture.md) - System design and mock service layer details.
- [`Agent Workflow`](docs/agent-workflow.md) - How the multi-agent pipeline operates.
- [`Prompt Engineering`](docs/prompt-engineering.md) - The personas and schemas designed for the agents.
- [`RAG Design`](docs/rag-design.md) - How the simulated Retrieval-Augmented Generation works.
- [`Future Roadmap`](docs/future-production-roadmap.md) - Path to taking this to production with LangGraph and real LLMs.

---
<div align="center">
  <i>Built with precision for the AIONOS demonstration.</i>
</div>
