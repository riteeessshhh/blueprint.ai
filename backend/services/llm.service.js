const MODELS = [
  "gemini-3.5-flash",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-latest"
];

async function callLLM(prompt, modelIndex = 0, retries = 2) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = MODELS[modelIndex];
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  console.log(`Calling ${model}...`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{
          text: "You are a JSON-only curriculum architect. You output strictly valid JSON arrays with no markdown, no explanations, and no text outside the JSON. Every activity you write must be ultra-specific with a concrete deliverable — never generic."
        }]
      },
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        responseMimeType: "application/json"
      }
    })
  });

  // Retry on rate limit (429) or server overload (503)
  if ((response.status === 429 || response.status === 503) && retries > 0) {
    const waitSec = 15;
    console.warn(`${model} returned ${response.status}. Retrying in ${waitSec}s... (${retries} retries left)`);
    await new Promise(resolve => setTimeout(resolve, waitSec * 1000));
    return callLLM(prompt, modelIndex, retries - 1);
  }

  // If this model is completely unavailable, try the next fallback model
  if ((response.status === 429 || response.status === 503) && retries === 0 && modelIndex < MODELS.length - 1) {
    console.warn(`${model} exhausted retries. Falling back to ${MODELS[modelIndex + 1]}...`);
    return callLLM(prompt, modelIndex + 1, 2);
  }

  if (!response.ok) {
    const errorData = await response.text();
    console.error(`Gemini API Error (${model}):`, errorData);
    throw new Error(`Gemini API request failed with status ${response.status}`);
  }

  const data = await response.json();
  console.log(`${model} responded successfully.`);
  return data.candidates[0].content.parts[0].text;
}

module.exports = callLLM;
