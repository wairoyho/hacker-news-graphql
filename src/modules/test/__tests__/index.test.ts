import sum, { sumIf } from "../index";

describe("test1 index: sum", () => {
  it("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(3);
  });
});

describe("test1 index: sumIf", () => {
  test("if a > 0", () => {
    expect(sumIf(1, 2)).toBe(3);
  });

  test("if a = 0", () => {
    expect(sumIf(0, 2)).toBe(0);
  });

  test("if a < 0", () => {
    expect(sumIf(0, 2)).toBe(0);
  });
});
