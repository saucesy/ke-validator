class ParameterException extends Error {
  constructor(message) {
    super();
    this.message = message || "参数错误";
  }
}

export default ParameterException;
