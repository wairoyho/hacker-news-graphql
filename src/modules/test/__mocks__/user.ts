const user = jest.createMockFromModule("../user");

// @ts-ignore
user.getAuthenticated = () => ({
  age: 622,
  name: "Mock name",
});

export default user;
