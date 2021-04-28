import user from "../user";

test("if orginal user model", () => {
  expect(user.getAuthenticated()).toEqual({ age: 26, name: "Real name" });
});
