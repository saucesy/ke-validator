class TypeException extends Error {
  constructor(message) {
    super();
    this.message = message || "类型错误";
  }
}

export default TypeException;
