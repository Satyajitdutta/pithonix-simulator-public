// Pithonix Simulator — Gemini Proxy
// Receives: full Gemini generateContent request body (no API key)
// Adds server-side GEMINI_API_KEY and forwards to Gemini
// Returns: full Gemini response body

const https = require('https');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }

  let body;
  try {
    if (typeof req.body === 'object') body = req.body;
    else {
      const raw = await new Promise(function(resolve) {
        let d = ''; req.on('data', function(c){ d += c; }); req.on('end', function(){ resolve(d); });
      });
      body = JSON.parse(raw);
    }
  } catch(e) { res.status(400).json({ error: 'Invalid JSON' }); return; }

  const model = body._model || 'gemini-2.5-pro';
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) { res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' }); return; }

  // Remove internal routing field before forwarding
  delete body._model;

  const data = JSON.stringify(body);
  const path = `/v1beta/models/${model}:generateContent?key=${apiKey}`;

  return new Promise(function(resolve) {
    const geminiReq = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: path,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, function(geminiRes) {
      let raw = '';
      geminiRes.on('data', function(c){ raw += c; });
      geminiRes.on('end', function(){
        try {
          const parsed = JSON.parse(raw);
          res.status(geminiRes.statusCode).json(parsed);
        } catch(e) {
          res.status(geminiRes.statusCode).send(raw);
        }
        resolve();
      });
    });
    geminiReq.on('error', function(e){
      res.status(500).json({ error: e.message });
      resolve();
    });
    geminiReq.write(data);
    geminiReq.end();
  });
};
