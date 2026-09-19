import { Router, Request, Response } from 'express';
import { getSanitizedConfig } from '../config.ts';
import { geminiGateway } from '../geminiGateway.ts';
import { retrievalService } from '../retrievalService.ts';

export const aiRouter = Router();

// GET /health & /api/health
const handleHealth = (_req: Request, res: Response) => {
  res.json(getSanitizedConfig());
};
aiRouter.get('/health', handleHealth);
aiRouter.get('/api/health', handleHealth);

// POST /api/ai/intake & /ai/intake
const handleIntake = async (req: Request, res: Response) => {
  try {
    const { inquiry, budget, timeline, objective, challenges } = req.body || {};
    if (!inquiry || typeof inquiry !== 'string') {
      res.status(400).json({ error: 'Missing or invalid "inquiry" string in request body' });
      return;
    }

    const { result, isLive } = await geminiGateway.runIntakeAgent({
      inquiry,
      budget,
      timeline,
      objective,
      challenges,
    });

    res.json({ success: true, isLive, data: result });
  } catch (err: any) {
    console.error('Error in intake endpoint:', err);
    res.status(500).json({ error: 'Failed to process intake workflow', message: err.message });
  }
};
aiRouter.post('/ai/intake', handleIntake);
aiRouter.post('/api/ai/intake', handleIntake);

// POST /api/ai/qualification & /ai/qualification
const handleQualification = async (req: Request, res: Response) => {
  try {
    const { intakeResult } = req.body || {};
    if (!intakeResult) {
      res.status(400).json({ error: 'Missing "intakeResult" in request body' });
      return;
    }

    const { result, isLive } = await geminiGateway.runQualificationAgent(intakeResult);
    res.json({ success: true, isLive, data: result });
  } catch (err: any) {
    console.error('Error in qualification endpoint:', err);
    res.status(500).json({ error: 'Failed to process qualification workflow', message: err.message });
  }
};
aiRouter.post('/ai/qualification', handleQualification);
aiRouter.post('/api/ai/qualification', handleQualification);

// POST /api/ai/capabilities & /ai/capabilities
const handleCapabilities = async (req: Request, res: Response) => {
  try {
    const { requirements, query } = req.body || {};
    const reqList = Array.isArray(requirements) ? requirements : [];

    // Keyword RAG retrieval
    const searchString = query || reqList.map((r: any) => r.description || '').join(' ');
    const retrievedDocs = retrievalService.search(searchString, 4);

    const { result, isLive } = await geminiGateway.runCapabilityMatchingAgent(reqList, retrievedDocs);

    res.json({
      success: true,
      isLive,
      retrievalType: 'Demo Keyword Search',
      retrievedDocs: retrievedDocs.map(d => ({ id: d.id, title: d.title, summary: d.summary })),
      data: result,
    });
  } catch (err: any) {
    console.error('Error in capabilities endpoint:', err);
    res.status(500).json({ error: 'Failed to process capability matching workflow', message: err.message });
  }
};
aiRouter.post('/ai/capabilities', handleCapabilities);
aiRouter.post('/api/ai/capabilities', handleCapabilities);

// POST /api/ai/proposal & /ai/proposal
const handleProposal = async (req: Request, res: Response) => {
  try {
    const { title, company, inquiry, intake, qualification, capabilities } = req.body || {};

    const retrievedDocs = retrievalService.search(`${title} ${company} ${inquiry || ''}`, 4);

    const { result, isLive } = await geminiGateway.runProposalAgent({
      title: title || 'Enterprise Opportunity',
      company: company || 'Client Organization',
      inquiry: inquiry || '',
      intake: intake || {},
      qualification: qualification || {},
      capabilities: Array.isArray(capabilities) ? capabilities : [],
      docs: retrievedDocs,
    });

    res.json({ success: true, isLive, data: result });
  } catch (err: any) {
    console.error('Error in proposal endpoint:', err);
    res.status(500).json({ error: 'Failed to process proposal workflow', message: err.message });
  }
};
aiRouter.post('/ai/proposal', handleProposal);
aiRouter.post('/api/ai/proposal', handleProposal);

// POST /api/ai/follow-ups & /ai/follow-ups
const handleFollowUps = async (req: Request, res: Response) => {
  try {
    const { opportunity } = req.body || {};

    const { result, isLive } = await geminiGateway.runFollowUpPlannerAgent(opportunity || {});
    res.json({ success: true, isLive, data: result });
  } catch (err: any) {
    console.error('Error in follow-ups endpoint:', err);
    res.status(500).json({ error: 'Failed to process follow-ups workflow', message: err.message });
  }
};
aiRouter.post('/ai/follow-ups', handleFollowUps);
aiRouter.post('/api/ai/follow-ups', handleFollowUps);

// POST /api/ai/workflow & /ai/workflow
const handleWorkflow = async (req: Request, res: Response) => {
  try {
    const { title, company, inquiry, budget, timeline, objective, challenges } = req.body || {};
    if (!inquiry) {
      res.status(400).json({ error: 'Missing "inquiry" field' });
      return;
    }

    // Step 1: Intake Agent
    const intakeRes = await geminiGateway.runIntakeAgent({ inquiry, budget, timeline, objective, challenges });

    // Step 2: Qualification Agent
    const qualRes = await geminiGateway.runQualificationAgent(intakeRes.result);

    // Step 3: Capability Matching Agent (with RAG retrieval)
    const retrievedDocs = retrievalService.search(`${inquiry} ${objective || ''}`, 4);
    const capRes = await geminiGateway.runCapabilityMatchingAgent(intakeRes.result.requirements, retrievedDocs);

    // Step 4: Proposal Agent
    const propRes = await geminiGateway.runProposalAgent({
      title: title || 'Opportunity Proposal',
      company: company || 'Client',
      inquiry,
      intake: intakeRes.result,
      qualification: qualRes.result,
      capabilities: capRes.result.matches,
      docs: retrievedDocs,
    });

    // Step 5: Follow-up Planner Agent
    const followRes = await geminiGateway.runFollowUpPlannerAgent({
      title,
      company,
      intake: intakeRes.result,
      qualification: qualRes.result,
      proposal: propRes.result,
    });

    const isAnyLive = intakeRes.isLive || qualRes.isLive || capRes.isLive || propRes.isLive || followRes.isLive;

    res.json({
      success: true,
      isLive: isAnyLive,
      data: {
        intake: intakeRes.result,
        qualification: qualRes.result,
        capabilities: capRes.result.matches,
        proposal: propRes.result,
        followUps: followRes.result.tasks,
        retrievedDocs: retrievedDocs.map(d => ({ id: d.id, title: d.title, summary: d.summary })),
      },
    });
  } catch (err: any) {
    console.error('Error in workflow endpoint:', err);
    res.status(500).json({ error: 'Orchestrated workflow failed', message: err.message });
  }
};
aiRouter.post('/ai/workflow', handleWorkflow);
aiRouter.post('/api/ai/workflow', handleWorkflow);
