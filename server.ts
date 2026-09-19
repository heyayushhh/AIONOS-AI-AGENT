import express from 'express';
import path from 'path';
import { config, getSanitizedConfig } from './server/config';
import { aiRouter } from './server/routes/ai';

const app = express();

app.use(express.json());

// Mount API router under /api and root /health
app.use(aiRouter);
app.get('/health', (_req, res) => {
  res.json(getSanitizedConfig());
});

// Serve static frontend files in production if dist directory exists
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/health') {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), err => {
    if (err) {
      res.status(404).send('Not Found');
    }
  });
});

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`[DealFlow AI Server] Server running on http://localhost:${config.port}`);
    console.log(`[DealFlow AI Server] AI Mode: ${getSanitizedConfig().mode.toUpperCase()}`);
    console.log(`[DealFlow AI Server] Configured Model: ${config.geminiModel}`);
  });
}

export default app;
