import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ override: true });

function getApiKey(): string {
  // 1. Check process.env
  let key = (process.env.GEMINI_API_KEY || '').trim();

  // 2. Read directly from .env file on disk to pick up edits instantly
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(/^GEMINI_API_KEY=(.+)$/m);
      if (match && match[1]) {
        const extracted = match[1].trim().replace(/^["']|["']$/g, '');
        if (extracted && !extracted.includes('your_gemini') && !extracted.includes('your_key') && !extracted.includes('MY_GEMINI')) {
          key = extracted;
        }
      }
    }
  } catch (e) {
    // Ignore read errors
  }

  // 3. Check .env.example fallback if user accidentally pasted key there
  if (!key || key === 'your_gemini_api_key_here' || key === 'your_key_here' || key === 'MY_GEMINI_API_KEY') {
    try {
      const examplePath = path.resolve(process.cwd(), '.env.example');
      if (fs.existsSync(examplePath)) {
        const exampleContent = fs.readFileSync(examplePath, 'utf-8');
        const match = exampleContent.match(/^GEMINI_API_KEY=(.+)$/m);
        if (match && match[1]) {
          const extracted = match[1].trim().replace(/^["']|["']$/g, '');
          if (extracted && !extracted.includes('your_gemini') && !extracted.includes('your_key') && !extracted.includes('MY_GEMINI')) {
            key = extracted;
          }
        }
      }
    } catch (e) {
      // Ignore read errors
    }
  }

  return key;
}

export function isLiveMode(): boolean {
  const key = getApiKey();
  if (!key || key === '' || key === 'your_gemini_api_key_here' || key === 'your_key_here' || key === 'MY_GEMINI_API_KEY') {
    return false;
  }
  
  const mode = (process.env.AI_MODE || 'live').toLowerCase();
  return mode !== 'disabled' && mode !== 'off' && mode !== 'force_demo';
}

export const config = {
  get geminiApiKey() {
    return getApiKey();
  },
  get geminiModel() {
    return process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  },
  get aiMode() {
    return (process.env.AI_MODE || 'live').toLowerCase();
  },
  port: parseInt(process.env.PORT || '3000', 10),
};

export function getSanitizedConfig() {
  const key = getApiKey();
  const hasKey = Boolean(key && key !== '' && !key.includes('your_gemini') && !key.includes('your_key') && key !== 'MY_GEMINI_API_KEY');
  const live = isLiveMode();

  return {
    status: 'ok',
    mode: live ? 'live' : 'demo',
    hasApiKey: hasKey,
    model: config.geminiModel,
    message: hasKey ? 'Valid Gemini API key detected.' : 'GEMINI_API_KEY is empty or unsaved in .env.',
  };
}
