export const decisionKeywords = [
  "head of",
  "chief",
  "ceo",
  "cto",
  "coo",
  "founder",
  "president",
  "vp",
  "vice president",
  "director",
  "managing director",
  "owner"
];

export const influencerKeywords = [
  "manager",
  "lead",
  "principal",
  "senior",
  "architect",
  "specialist",
  "consultant",
  "analyst"
];

export function getRoleCategory(role = "") {
  const r = role.toLowerCase();
  if (decisionKeywords.some(k => r.includes(k))) return "decision_maker";
  if (influencerKeywords.some(k => r.includes(k))) return "influencer";
  return "other";
}
