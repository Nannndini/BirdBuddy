export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { base64, mimeType } = req.body;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.2-90b-vision-preview',
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Identify this bird species. Return ONLY valid JSON, no markdown, no explanation: {"commonName": "string", "scientificName": "string", "confidence": 0.85, "habitat": "string", "range": "string", "diet": "string", "behavior": "string", "funFact": "string"}'
            },
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${base64}` }
            }
          ]
        }],
        max_tokens: 500
      })
    });

    const data = await response.json();
    if (data.error) {
      return res.status(400).json(data);
    }
    const text = data.choices[0].message.content;
    const parsed = JSON.parse(text.replace(/```json|```/gi, '').trim());
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
}
