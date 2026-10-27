import { describe, expect, it } from "vitest";
import { statsAr, statsEn } from "./stats";

describe("landing stats", () => {
  it("uses the same numbers in English and Arabic", () => {
    expect(statsAr.map((s) => s.v)).toEqual(statsEn.map((s) => s.v));
  });
});
