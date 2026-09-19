# Demonstration Guide

Follow these steps to run a complete walkthrough of DealFlow AI in both **Demo Mode** and **Live AI Mode**.

## Prerequisites

1. **Node.js**: Ensure Node.js (v18+) is installed.
2. **Start App**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`.

---

## Mode Setup

### Option A: Demo Mode (No API Key Required)
- Run `npm run dev` out-of-the-box.
- Notice the **🟡 Demo Mode (Fallback)** badge in the sidebar header.
- Uses deterministic local mock fallbacks.

### Option B: Live Gemini AI Mode
- Edit `.env` in the root directory:
  ```env
  GEMINI_API_KEY=your_actual_gemini_api_key
  GEMINI_MODEL=gemini-2.5-flash
  AI_MODE=live
  ```
- Restart dev server (`npm run dev`).
- Notice the **🟢 Live Gemini AI Mode** badge in the sidebar header!

---

## Step-by-Step Walkthrough

1. **Landing Page**:
   - Navigate to `http://localhost:3000`.
   - Click **Open Workspace** in the top navigation bar.

2. **Dashboard**:
   - Click **+ New Opportunity** in the left sidebar or top right button.

3. **Opportunity Intake**:
   - Click the **Load Demo Inquiry** button in the top right.
   - Observe auto-filled parameters: Global Retail Alliance, AWS Cloud Modernization request, $5,000,000 budget, Q3 timeline.
   - Click **Analyze Opportunity**.

4. **Opportunity Workspace**:
   - Notice the **Agent Workflow Progress Timeline** at the top.
   - Click **Run Agent Workflow**.
   - Watch the 5 agents execute sequentially:
     1. **01 Intake Agent**: Extracts requirements and flags missing details.
     2. **02 Qualification Agent**: Calculates fit score (labeled *Demo-generated estimate*).
     3. **03 Capability Matcher**: Executes RAG keyword search and cites source docs (`[doc-1]`, `[doc-3]`).
     4. **04 Proposal Agent**: Generates structured proposal draft.
     5. **05 Follow-up Planner**: Creates recommended human and AI task backlog.

5. **Reviewing Agent Results**:
   - Click through tabs: `Overview`, `Qualification`, `Requirements`, `Capabilities`, `Proposal`, `Follow-ups`.
   - Under `Capabilities`, view cited document IDs (`[doc-1]`, `[doc-3]`).
   - Under `Proposal`, view the synthesized sections.

6. **Human Approval Gate**:
   - In the `Proposal` tab, notice the banner: **Requires Human Approval**.
   - Click **Approve Proposal**.
   - Observe stage update to **Approved**!
