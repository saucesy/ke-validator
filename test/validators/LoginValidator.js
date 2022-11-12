import {KeValidator, Rule} from "../../src/index.js";

class LoginValidator extends KeValidator {
  constructor() {
    super();
    this.username = [
      new Rule("isLength", "Username need to be between 4 and 12 characters long.", {min: 4, max: 12}),
    ];
    this.password = [
      new Rule(
        "isLength",
        "Password need to be between 6 and 32 characters long.",
        {min: 6, max: 32},
      ),
      new Rule(
        "matches",
        "The password is not strong enough. It needs to include numbers, letters, and special characters.",
        /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^\da-zA-Z\s]).{6,32}$/,
      ),
    ];
  }
}

export default LoginValidator;
