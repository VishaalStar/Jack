import { processAgentCommand } from '../server/geminiService.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { prompt, context } = req.body || {};
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await processAgentCommand({ prompt, context });
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Vercel Agent processing error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
