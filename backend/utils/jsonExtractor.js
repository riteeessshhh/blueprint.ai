function sanitizeLooseJSON(text) {
  // Fix unquoted values like: "type": yes_no
  return text
    // quote unquoted string values
    .replace(/:\s*([a-zA-Z_]+)(\s*[,\}])/g, ':"$1"$2')
    // quote unquoted questions
    .replace(/"question"\s*:\s*([^",\n]+)(\s*[,\}])/g, '"question":"$1"$2');
}

function extractJSON(text) {
  if (!text || typeof text !== "string") {
    throw new Error("LLM response is not a string");
  }

  let cleaned = text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");

  // Prefer ARRAY JSON
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");

  if (start === -1 || end === -1) {
    throw new Error("No JSON array found");
  }

  let jsonString = cleaned.slice(start, end + 1);

  // 🔥 SANITIZE BAD JSON
  jsonString = sanitizeLooseJSON(jsonString);

  // Remove trailing commas
  jsonString = jsonString.replace(/,\s*([\]}])/g, "$1");

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("❌ JSON PARSE FAILED");
    console.error("SANITIZED JSON:\n", jsonString);
    throw err;
  }
}

module.exports = extractJSON;
