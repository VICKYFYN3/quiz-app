import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  const scriptUrl = 'https://script.google.com/macros/s/AKfycbwRqMKpNLfOMMfIiMTaIIaTdtHUiafWPcMCnEvlD-xqg7wxuxmnwExUzXHRj_VvDNvP/exec';

  try {
    // Check for matric existence
    if (req.body && req.body.checkMatric && req.body.matric) {
      const response = await fetch(scriptUrl, {
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
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}