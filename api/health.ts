export default function handler(_req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    status: 'ok',
    agent: 'Jack AI Executive Workstation',
    platform: 'Vercel Serverless',
    timestamp: new Date().toISOString()
  });
}
