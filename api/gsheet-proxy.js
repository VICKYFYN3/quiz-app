export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  const response = await fetch('https://script.google.com/macros/s/AKfycbwRqMKpNLfOMMfIiMTaIIaTdtHUiafWPcMCnEvlD-xqg7wxuxmnwExUzXHRj_VvDNvP/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });

  const data = await response.text();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(data);
} 