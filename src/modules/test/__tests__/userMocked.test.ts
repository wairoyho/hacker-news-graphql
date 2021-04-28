import user from "../user";

jest.mock("../user");

test("if user model is mocked", () => {
  expect(user.getAuthenticated()).toEqual({ age: 622, name: "Mock name" });
});
