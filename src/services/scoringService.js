
import { getRoleCategory } from "../utils/roleUtils.js";

export function computeRuleScore(lead, offer) {
  let score = 0;
  // role
  const roleCat = getRoleCategory(lead.role || "");
  if (roleCat === "decision_maker") score += 20;
  else if (roleCat === "influencer") score += 10;

  // industry match
  const industry = (lead.industry || "").toLowerCase();
  const company = (lead.company || "").toLowerCase();
  const bio = (lead.linkedin_bio || "").toLowerCase();

  let industryPoints = 0;
  if (Array.isArray(offer.ideal_use_cases)) {
    for (const icp of offer.ideal_use_cases) {
      const icpNorm = icp.toLowerCase();
      // exact-ish (substring) match in industry or company or bio
      if (industry && (icpNorm === industry || industry.includes(icpNorm))) {
        industryPoints = 20; break;
      }
      if (company && company.includes(icpNorm)) {
        industryPoints = Math.max(industryPoints, 10);
      }
      // adjacent: share a common token
      const icpTokens = icpNorm.split(/\W+/).filter(Boolean);
      const anyCommon = icpTokens.some(t => industry.includes(t) || bio.includes(t) || company.includes(t));
      if (anyCommon && industryPoints < 20) industryPoints = Math.max(industryPoints, 10);
    }
  }
  score += industryPoints;

  // completeness
  const allFields = ["name", "role", "company", "industry", "location", "linkedin_bio"];
  const complete = allFields.every(f => lead[f] && String(lead[f]).trim().length > 0);
  if (complete) score += 10;

  // clamp 0-50
  if (score > 50) score = 50;
  return score;
}

/**
 * Map AI-labeled intent to points:
 * High -> 50, Medium -> 30, Low -> 10
 */
export function aiIntentToPoints(intent) {
  const it = (intent || "").toString().toLowerCase();
  if (it === "high") return 50;
  if (it === "medium") return 30;
  return 10;
}

/**
 * Full scoring for a single lead (calls rule layer + expects aiResult from AI)
 * returns { score, intent, reasoning, rule_score, ai_points, total_score }
 */
export function finalizeScoringForLead(lead, offer, aiResult) {
  const rule_score = computeRuleScore(lead, offer);
  const ai_points = aiIntentToPoints(aiResult?.intent);
  const total = rule_score + ai_points;
  const clamped = Math.max(0, Math.min(100, total));
  return {
    name: lead.name,
    role: lead.role,
    company: lead.company,
    industry: lead.industry,
    intent: aiResult.intent,
    score: clamped,
    reasoning: aiResult.reasoning,
    rule_score,
    ai_points
  };
}
