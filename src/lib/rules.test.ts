import { describe, expect, it } from "vitest";
import { boundaryTests, buildRules, buildStages, diffStage, evaluate, policyChecks, releaseEligibility, stageHash } from "./rules";

describe("evaluate", () => {
  const v1 = buildRules(1);
  const v2 = buildRules(2);
  it("lets Khalifa sign alone at the limit and blocks one dirham above", () => {
    expect(evaluate({ initiator: "khalifa", approvers: [], amount: 10_000, currency: "AED" }, v1).outcome).toBe("allowed");
    expect(evaluate({ initiator: "khalifa", approvers: [], amount: 10_001, currency: "AED" }, v1).outcome).toBe("blocked");
    expect(evaluate({ initiator: "khalifa", approvers: [], amount: 25_000, currency: "AED" }, v2).outcome).toBe("allowed");
    expect(evaluate({ initiator: "khalifa", approvers: [], amount: 25_001, currency: "AED" }, v2).outcome).toBe("blocked");
  });
  it("allows any two jointly at any amount", () => {
    expect(evaluate({ initiator: "mohammed", approvers: ["khalifa"], amount: 900_000, currency: "AED" }, v1).outcome).toBe("allowed");
  });
  it("holds a signatory with pending KYC", () => {
    expect(evaluate({ initiator: "rashid", approvers: ["khalifa"], amount: 100, currency: "AED" }, v1, ["rashid"]).outcome).toBe("held");
    expect(evaluate({ initiator: "rashid", approvers: ["khalifa"], amount: 100, currency: "AED" }, v1, []).outcome).toBe("allowed");
  });
  it("does not infer other currencies", () => {
    expect(evaluate({ initiator: "khalifa", approvers: ["mohammed"], amount: 1, currency: "USD" }, v1).outcome).toBe("not_covered");
  });
});

describe("boundary tests and policy", () => {
  it("all pass for both versions", () => {
    for (const v of [1, 2] as const) {
      expect(boundaryTests(buildRules(v), ["rashid"]).every((t) => t.pass)).toBe(true);
      expect(policyChecks(v, ["rashid"]).every((c) => c.pass)).toBe(true);
    }
  });
});

describe("releaseEligibility", () => {
  it("allows partial release when Rashid is held", () => {
    const e = releaseEligibility(buildRules(2), ["rashid"]);
    expect(e.eligible).toBe(true);
    expect(e.combos[0].groups).toEqual([["mohammed", "khalifa"]]);
  });
  it("holds all when only Mohammed is ready", () => {
    expect(releaseEligibility(buildRules(2), ["rashid", "khalifa"]).eligible).toBe(false);
  });
  it("still eligible when only Khalifa is ready, via his single right", () => {
    expect(releaseEligibility(buildRules(2), ["rashid", "mohammed"]).eligible).toBe(true);
  });
});

describe("stages", () => {
  it("v2 changes only stages 3 and 4", () => {
    const a = buildStages(1);
    const b = buildStages(2);
    expect(a.map((s, i) => stageHash(s) === stageHash(b[i]))).toEqual([true, true, false, false]);
    expect(diffStage(a[2], b[2])).toHaveLength(1);
    expect(diffStage(a[2], b[2])[0].after).toContain("25,000");
  });
});
