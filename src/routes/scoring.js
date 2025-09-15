import express from "express";
import store from "../storage/store.js";
import { askAIForIntent } from "../services/aiClient.js";
import { finalizeScoringForLead } from "../services/scoringService.js";

const router = express.Router();

/**
 * POST /score
 * Runs scoring over all stored leads against the current offer.
 */
router.post("/", async (req, res) => {
  const leads = await store.read("leads");
  const offer = await store.read("offers");
  if (!offer || !offer.name) {
    return res.status(400).json({ error: "No offer found. POST /offer first." });
  }
  const results = [];

  for (const lead of leads) {
    // prepare minimal prospect info to pass to AI
    const prospectForAI = {
      name: lead.name,
      role: lead.role,
      company: lead.company,
      industry: lead.industry,
      location: lead.location,
      linkedin_bio: lead.linkedin_bio
    };
    const aiResult = await askAIForIntent(prospectForAI, offer);
    // ensure normalized intent
    aiResult.intent = (aiResult.intent || "Medium").toString();
    const final = finalizeScoringForLead(lead, offer, aiResult);
    results.push(final);
  }

  // persist results
  await store.write("results", results);
  res.json({ ok: true, count: results.length, results });
});

export default router;
