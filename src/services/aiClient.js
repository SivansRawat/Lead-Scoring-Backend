import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.warn("Warning: OPENAI_API_KEY not set. AI layer will return fallback values.");
}
const client = apiKey ? new OpenAI({ apiKey }) : null;


export async function askAIForIntent(lead, offer) {
  if (!client) {
    return { intent: "Medium", reasoning: "No OPENAI_API_KEY provided; defaulted to Medium." };
  }

  const prompt = [
    `You are a concise sales-intent classifier. Given a product/offer and a single prospect, classify their buying intent as High, Medium, or Low and give a 1-2 sentence reasoning.`,
    `Respond in JSON only, like: {"intent":"High","reasoning":"..."} - no extra commentary.`,
    `Offer: ${JSON.stringify(offer)}`,
    `Prospect: ${JSON.stringify(lead)}`
  ].join("\n\n");

  try {
    const resp = await client.responses.create({
      model: "gpt-4o-mini", 
      input: prompt,
      max_output_tokens: 150
    });

    let text = resp.output_text ?? null;
    if (!text && Array.isArray(resp.output) && resp.output.length) {
      const block = resp.output[0];
      text = (block?.content || []).map(c => c?.text || "").join(" ").trim();
    }
    if (!text) {
      return { intent: "Medium", reasoning: "AI returned no text; defaulting to Medium." };
    }

    const firstJsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonText = firstJsonMatch ? firstJsonMatch[0] : text;
    const parsed = JSON.parse(jsonText);
    parsed.intent = (parsed.intent || "Medium").toString().trim();
    return parsed;
  } catch (err) {
    console.error("AI error:", err?.message || err);
    return { intent: "Medium", reasoning: `AI error: ${err?.message || "unknown"}` };
  }
}
