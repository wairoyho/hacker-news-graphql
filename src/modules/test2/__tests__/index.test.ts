import addOneIfEven from "../index";

jest.mock("@modules/test");

describe("test2 index", () => {
  // beforeEach(() => {
  //   require("@modules/test");
  // });

  test("odd number", () => {
    expect(addOneIfEven(11)).toBe(11);
  });

  test("event number", () => {
    expect(addOneIfEven(12)).toBe(17);
  });
});
