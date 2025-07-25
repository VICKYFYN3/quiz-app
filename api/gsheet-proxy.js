import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  // Check for matric existence
  if (req.body && req.body.checkMatric && req.body.matric) {
    // Forward the check to Google Apps Script with a special flag
    const response = await fetch('https://script.google.com/macros/s/AKfycbwRqMKpNLfOMMfIiMTaIIaTdtHUiafWPcMCnEvlD-xqg7wxuxmnwExUzXHRj_VvDNvP/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkMatric: true, matric: req.body.matric }),
    });
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
    return;
  }

  // Normal quiz submission
  const response = await fetch('https://script.google.com/macros/s/AKfycbwRqMKpNLfOMMfIiMTaIIaTdtHUiafWPcMCnEvlD-xqg7wxuxmnwExUzXHRj_VvDNvP/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });

  const data = await response.text();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(data);
} 