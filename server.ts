import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { processAgentCommand } from './server/geminiService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Server-side API endpoint for Jack AI
app.post('/api/agent', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const result = await processAgentCommand({ prompt, context });
    return res.json(result);
  } catch (error: any) {
    console.error('Agent processing error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    agent: 'Jack AI Business & Marketing Siri',
    encrypted: true,
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString()
  });
});

// Serve static frontend assets from dist in production
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Jack AI Executive Agent Server running on port ${port}`);
});
