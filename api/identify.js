export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { base64, mimeType } = req.body;
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: mimeType, data: base64 } },
            { text: "Identify this bird. Return ONLY valid JSON no markdown: {\"commonName\": string, \"scientificName\": string, \"confidence\": number, \"habitat\": string, \"range\": string, \"diet\": string, \"behavior\": string, \"funFact\": string}" }
          ]
        }]
      })
    }
  );
  
  const data = await response.json();
  res.json(data);
}
