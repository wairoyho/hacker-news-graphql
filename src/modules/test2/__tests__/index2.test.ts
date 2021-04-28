import addOneIfEven from "../index";

jest.mock("@modules/test");

describe("test2 index2", () => {
  // beforeEach(() => {
  //   require("@modules/test");
  // });

  test("odd number", () => {
    expect(addOneIfEven(1)).toBe(1);
  });

  test("event number", () => {
    expect(addOneIfEven(2)).toBe(7);
  });
});
