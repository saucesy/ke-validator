class RuleResult {
  constructor(pass, message) {
    this.pass = pass || false;
    this.message = message || "";
  }
  
  setPass(pass) {
    this.pass = pass;
  }
  
  setMessage(message) {
    this.message = message;
  }
}

export default RuleResult;
