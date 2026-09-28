import { describe, expect, it } from "vitest";
import { nextInstanceNames } from "./instance-names";

describe("nextInstanceNames", () => {
  it("uses the bare name for the first single copy", () => {
    expect(nextInstanceNames("Bandit", [], 1)).toEqual({
      newNames: ["Bandit"],
    });
  });

  it("numbers every copy when several are added at once", () => {
    expect(nextInstanceNames("Bandit", [], 3)).toEqual({
      newNames: ["Bandit 1", "Bandit 2", "Bandit 3"],
    });
  });

  it("renames a lone bare sibling to 1 and numbers the new copy 2", () => {
    expect(nextInstanceNames("Bandit", ["Bandit"], 1)).toEqual({
      newNames: ["Bandit 2"],
      renameBareTo: "Bandit 1",
    });
  });

  it("continues from the highest existing number, leaving gaps alone", () => {
    expect(nextInstanceNames("Bandit", ["Bandit 1", "Bandit 3"], 2)).toEqual(
      { newNames: ["Bandit 4", "Bandit 5"] },
    );
  });

  it("ignores siblings the GM renamed", () => {
    expect(nextInstanceNames("Bandit", ["Leader", "Bandit 2"], 1)).toEqual({
      newNames: ["Bandit 3"],
    });
  });

  it("numbers from 1 when all siblings were renamed", () => {
    expect(nextInstanceNames("Bandit", ["Leader"], 1)).toEqual({
      newNames: ["Bandit 1"],
    });
  });

  it("renames a bare sibling after the highest number when numbered ones exist", () => {
    expect(nextInstanceNames("Bandit", ["Bandit", "Bandit 2"], 1)).toEqual({
      newNames: ["Bandit 4"],
      renameBareTo: "Bandit 3",
    });
  });

  it("does not treat names with a non-numeric suffix as numbered", () => {
    expect(nextInstanceNames("Bandit", ["Bandit Chief"], 1)).toEqual({
      newNames: ["Bandit 1"],
    });
  });

  it("handles base names containing regex characters", () => {
    expect(nextInstanceNames("Wolf (Alpha)", ["Wolf (Alpha)"], 1)).toEqual({
      newNames: ["Wolf (Alpha) 2"],
      renameBareTo: "Wolf (Alpha) 1",
    });
  });
});
