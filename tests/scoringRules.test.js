import { computeRuleScore, aiIntentToPoints } from "../src/services/scoringService.js";

describe("Rule layer scoring", () => {
  test("decision maker + industry exact + completeness", () => {
    const lead = {
      name: "A",
      role: "Head of Growth",
      company: "FlowMetrics",
      industry: "B2B SaaS",
      location: "Remote",
      linkedin_bio: "SaaS growth"
    };
    const offer = { ideal_use_cases: ["B2B SaaS mid-market"] };
    const rule = computeRuleScore(lead, offer);
    // role(20) + industry(20 or 10) + completeness(10) => expect >= 40
    expect(rule).toBeGreaterThanOrEqual(40);
  });

  test("influencer only, incomplete fields", () => {
    const lead = { name: "B", role: "Manager", company: "", industry: "", location: "", linkedin_bio: "" };
    const offer = { ideal_use_cases: ["Retail"] };
    const rule = computeRuleScore(lead, offer);
    expect(rule).toBe(10); // influencer +10
  });

  test("ai mapping", () => {
    expect(aiIntentToPoints("High")).toBe(50);
    expect(aiIntentToPoints("Medium")).toBe(30);
    expect(aiIntentToPoints("Low")).toBe(10);
  });
});
