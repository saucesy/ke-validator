import {KeValidator, Rule} from "../../src";

class LoginValidator extends KeValidator {
  constructor() {
    super();
    this.username = [
      new Rule({
        name: "isLength",
        message: "Username need to be between 4 and 12 characters long.",
        options: {min: 4, max: 12},
      }),
    ];
    this.password = [
      new Rule({
        name: "isLength",
        message: "Password need to be between 6 and 32 characters long.",
        options: {min: 6, max: 32},
      }),
    ];
  }
  
  verifyPassword(row) {
    if (row.repassword !== row.password) {
      throw new Error("The password is different twice.");
    }
  }
}

export default LoginValidator;
