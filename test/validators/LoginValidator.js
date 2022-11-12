import {KeValidator, Rule} from "../../dist/ke-validator.esm.js";

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
    ];
    
    this.validateFn = function (v) {
      // throw new Error("There's a mistake here.");
    }
  }
}

export default LoginValidator;
