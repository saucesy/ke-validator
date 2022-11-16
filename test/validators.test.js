import LoginValidator from "./validators/LoginValidator.js";

describe("LoginValidator", () => {
  const object = {
    body: {username: "saucesy", password: "123456", repassword: "123456"},
    query: {page: 10},
    params: {uid: "fdb30486-ad9e-4c68-b50e-8450ea205244"},
    headers: {authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"}
  };
  
  let loginValidator = null;
  
  beforeAll(() => {
    loginValidator = new LoginValidator();
  });
  
  afterAll(() => {
    loginValidator = null;
  });
  
  describe("validate 方法执行前", () => {
    test("未调用validate方法之前调用get会抛出异常", () => {
      expect(() => {
        loginValidator.get("");
      }).toThrow();
    });
    
    test("调用validate方法传入的是非对象类型会抛出异常", () => {
      expect(() => {
        loginValidator.validate("");
      }).toThrow();
    });
    
    test("调用validate方法未通过校验会抛出异常", () => {
      expect(() => {
        loginValidator.validate(object);
      }).toThrow();
    });
  });
  
  describe.only("validate 方法执行时", () => {
    beforeAll(() => {
      loginValidator.validate(object);
    });
    
    test("调用get方法能成功获取用户名", () => {
      const username = loginValidator.get("username");
      expect(username).toBe("saucesy");
    });

    test("调用get方法能成功获取密码", () => {
      const password = loginValidator.get("password");
      expect(password).toBe("123456");
    });

    test("调用get方法能成功获取authorization", () => {
      const password = loginValidator.get("authorization");
      expect(password).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
    });

    test("使用loginValidator.username能获取用户名", () => {
      const username = loginValidator.username;
      expect(username).toBe("saucesy");
    });

    test("使用loginValidator.authorization能获取", () => {
      const authorization = loginValidator.authorization;
      expect(authorization).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
    });

    test("使用loginValidator.body.username能获取用户名", () => {
      const username = loginValidator.body.username;
      expect(username).toBe("saucesy");
    });

    test("修改用户名，通过loginValidator.body.username能正确获取", () => {
      loginValidator.username = "saucesy.test";
      expect(loginValidator.body.username).toBe("saucesy.test");
    });

    test("修改用户名，通过loginValidator.get('username')能正确获取", () => {
      loginValidator.username = "saucesy.test";
      expect(loginValidator.get("username")).toBe("saucesy.test");
    });

    test("LoginValidator.validateFn函数在执行validate方法时会被调用", () => {
      loginValidator.verifyPassword = jest.fn();
      loginValidator.validate(object);
      expect(loginValidator.verifyPassword).toBeCalled();
    });
    
    test.skip("LoginValidator.verifyPassword函数抛出了异常，会被validate方法捕捉并相继抛出", () => {
      expect(() => {
        loginValidator.validate(object);
      }).toThrow();
    });
  });
});
