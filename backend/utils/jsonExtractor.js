function extractJSON(text) {
  if (!text || typeof text !== "string") {
    throw new Error("LLM response is not a string");
  }

  const startObj = text.indexOf("{");
  const startArr = text.indexOf("[");
  const endObj = text.lastIndexOf("}");
  const endArr = text.lastIndexOf("]");

  let start = -1;
  let end = -1;

  if (startArr !== -1 && (startObj === -1 || startArr < startObj)) {
    start = startArr;
    end = endArr;
  } else if (startObj !== -1) {
    start = startObj;
    end = endObj;
  }

  if (start === -1 || end === -1) {
    throw new Error("No JSON object or array found");
  }

  const jsonString = text.slice(start, end + 1);

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("❌ JSON PARSE FAILED");
    console.error("RAW JSON:\n", jsonString);
    throw err;
  }
}

module.exports = extractJSON;
