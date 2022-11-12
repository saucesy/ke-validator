import LoginValidator from "./validators/LoginValidator.js";

describe("LoginValidator", () => {
  const request = {
    body: { username: "saucesy", password: "saucesy@qq2.com" },
    query: {},
    params: {},
    headers: {},
  };
  let loginValidator = null;
  
  beforeAll(() => {
    loginValidator = new LoginValidator();
  });
  
  test("An exception is thrown before the validate method is called.", () => {
    expect(loginValidator.get("")).toThrow();
  });
});
