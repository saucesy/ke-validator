import validator from 'validator';

class RuleResult {
  constructor(pass, message = "") {
    this.pass = pass;
    this.message = message;
  }
}

class Rule {
  constructor({
    name,
    message,
    options
  }) {
    this.name = name;
    this.message = message;
    this.options = options;
  }
  validate(field) {
    if (this.name === "isOptional") {
      return new RuleResult(true);
    }
    if (!validator[this.name](field, this.options)) {
      return new RuleResult(false, this.message || "参数错误");
    }
    return new RuleResult(true, "");
  }
}

class RuleFieldResult extends RuleResult {
  constructor(pass, message = "", value = null) {
    super(pass, message);
    this.value = value;
  }
}

class RuleField {
  constructor(rules) {
    this.rules = rules;
  }
  validate({
    key,
    value
  }) {
    if (!value) {
      const isAllowEmpty = this._allowEmpty();
      if (isAllowEmpty) {
        return new RuleFieldResult(true, "");
      } else {
        return new RuleFieldResult(false, key + " 字段是必填参数");
      }
    }
    const fieldResult = new RuleFieldResult(false);
    for (const rule of this.rules) {
      const result = rule.validate(value);
      if (!result.pass) {
        fieldResult.value = null;
        fieldResult.message = result.message;
        return fieldResult;
      }
    }
    return new RuleFieldResult(true, "", this._convert(value));
  }
  _allowEmpty() {
    for (const rule of this.rules) {
      if (rule.name === "isOptional") {
        return true;
      }
    }
    return false;
  }
  _convert(value) {
    for (const rule of this.rules) {
      if (rule.name === "isInt") {
        return Number.parseInt(value);
      }
      if (rule.name === "isFloat") {
        return Number.parseFloat(value);
      }
      if (rule.name === "isBoolean") {
        return !!value;
      }
    }
    return value;
  }
}

function get(object, path, defaultValue) {
  if (typeof path !== "string") {
    throw new Error("The path argument must be a string");
  }
  let value = object;
  path = path.replace(/\[(.*?)]/g, ".$1").split(".");
  while (path.length) {
    value = value[path.shift()];
    if (!value) break;
  }
  value = value !== undefined ? value : defaultValue;
  return value;
}

function getKeys(object) {
  if (typeof object !== "object" || object === null) {
    return [];
  }
  return Object.keys(object);
}

function dfs(object, field) {
  let res;
  function search(data, key) {
    if (key === field) {
      return res = data;
    }
    const keys = getKeys(data);
    for (const key of keys) {
      search(data[key], key);
    }
  }
  search(object);
  return res;
}

function isArray(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
}

function isObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]" && value !== null;
}

function deepClone(object) {
  if (typeof object !== "object" || object == null) {
    return object;
  }
  if (object instanceof Date) {
    return new Date(object);
  }
  if (object instanceof RegExp) {
    return new RegExp(object);
  }
  const target = new object.__proto__.constructor();
  for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
      target[key] = deepClone(object[key]);
    }
  }
  return target;
}

function isFunction(value) {
  return Object.prototype.toString.call(value) === "[object Function]";
}

function proxyData(vm, target, depth = 1) {
  if (!isObject(target) || !depth) {
    return;
  }
  for (const key in target) {
    let value = target[key];
    proxyData(vm, value, --depth);
    Object.defineProperty(vm, key, {
      get() {
        return value;
      },
      set(newValue) {
        target[key] = newValue;
      }
    });
  }
}

class TypeException extends Error {
  constructor(message) {
    super();
    this.message = message || "类型错误";
  }
}

class OperateException extends Error {
  constructor(message) {
    super();
    this.message = message || "操作异常";
  }
}

class ParameterException extends Error {
  constructor(message) {
    super();
    this.message = message || "参数错误";
  }
}

class KeValidator {
  constructor() {
    this.$data = null;
    this.$fields = ["params", "query", "headers", "body"];
  }
  /**
   * 根据指定的key从请求对象中解析值，如果解析出来的value是undefined会被defaultValue取代。
   * @param {string} key - 指定的键名
   * @param {*} defaultValue - 默认值
   * @return {*} value
   * @example
   *  1、参数 key 可以为单个字符，也可以是字符串
   *  当为字符串时，需要用英文句号 "." 分隔符来表示多个属性.
   *  2、参数defaultValue作为在解析value值为undefined时的默认值，这是可选的.
   *
   *  假设request对象存在这样一些属性：
   *    {
   *      params: { id: 10 },
   *      body: { username: "xxx" },
   *      header： { authorization: "1010101" },
   *      ……
   *    }
   *
   *  你可以这样去获取值：
   *    - v.get("id") ==> 10
   *    - v.get("username") ==> xxx
   *    - v.get("authorization") ===> 1010101
   * @see https://github.com/saucesy/ke-validator#readme
   */
  get(key, defaultValue = undefined) {
    if (!this.$data) {
      throw new OperateException("The validate method is not allowed to be called before it is called.");
    }
    let value = null;
    for (const el of this.$fields) {
      value = get(this.$data, `${el}.${key}`, defaultValue);
      if (value) break;
    }
    return value;
  }
  /**
   * 根据request请求上下文对象做数据源，使用一系列规则来校验数据是否合法.
   * @example
   * 假如我们在做注册操作，需要对用户输入的用户名、密码、邮箱等做长度、强度、格式做校验
   * 你可以按照这样的操作来进行，当未通过规则时，你应该提前捕获异常，以免漏掉错误信息.
   *
   * 1、创建一个RegisterValidator类，继承KeValidator
   *  ……
   *    class RegisterValidator extends KEValidator {
   *      constructor() {
   *        super();
   *        this.username = [
   *          new Rule("isLength", "用户名长度需在4~12个字符之间", {min: 4, max: 12})
   *        ]
   *      }
   *    }
   *  ……
   *
   * 2、当请求到来时，你应该提前创建好RegisterValidator对象，并调用validate方法，传入request请求上下文对象
   *  ……
   *    new RegisterValidator().validate(request);
   *  ……
   * 3、验证器会为那些未通过的规则的值抛出异常，你应该去主动捕获并处理该异常，当然更好的策略是用一个全局异常捕获，这将省去一部分工作量
   *  ……
   *    try {
   *      new RegisterValidator().validate(request);
   *    } catch(error) {
   *      // do something...
   *    }
   *  ……
   * @see https://github.com/saucesy/ke-validator#readme
   * @param {object} object - 数据源
   * @return {KeValidator}
   */
  validate(object) {
    if (!isObject(object)) {
      throw new TypeException("The request must be an object type.");
    }
    if (object.isValidate) {
      throw new OperateException("Do not validate the same object twice.");
    }
    const params = this._assembleParams(object);
    this._setData(params);
    const memberKeys = this._findMembers();
    const errorMsg = [];
    for (const key of memberKeys) {
      const result = this._check(key);
      if (!result.pass) {
        errorMsg.push(result.message);
      }
    }
    if (errorMsg.length) {
      throw new ParameterException(errorMsg);
    }
    this._punchMark(object);
    this._attachDataToContext();
    return this;
  }
  _setData(data) {
    this.$data = deepClone(data);
  }
  _punchMark(data) {
    Object.defineProperty(data, "isValidate", {
      value: true
    });
  }
  _assembleParams(object) {
    const params = {};
    for (const field of this.$fields) {
      const value = dfs(object, field);
      if (value) {
        params[field] = value;
      }
      if (field === "query") {
        params[field] = JSON.parse(JSON.stringify(value));
      }
    }
    return params;
  }
  _assembleCompactParams() {
    return this.$fields.reduce((params, field) => Object.assign(params, this._findParams(field)), {});
  }
  _attachDataToContext() {
    proxyData(this, this.$data, 2);
  }
  _findMembers() {
    let proto = this;
    const members = [];
    while (proto !== KeValidator.prototype) {
      const names = Object.getOwnPropertyNames(proto);
      for (const name of names) {
        this._findMembersFilter(name) && members.push(name);
      }
      proto = proto.__proto__;
    }
    return members;
  }
  _findMembersFilter(key) {
    if (key === "constructor" || key === "$fields") {
      return false;
    }
    const value = this[key];
    if (isFunction(value)) {
      return true;
    }
    if (isArray(value) && key) {
      const isRuleType = value.every(v => v instanceof Rule);
      if (!isRuleType) {
        throw new Error("Verify that the elements of the array must be of type Rule.");
      }
      return true;
    }
    return false;
  }
  _check(key) {
    let result;
    if (isFunction(this[key])) {
      try {
        const row = this._createRow();
        this[key](row);
        result = new RuleResult(true);
      } catch (error) {
        result = new RuleResult(false, error.message || "Parameter Error.");
      }
    } else {
      const rules = this[key];
      const ruleField = new RuleField(rules);
      const params = this._findParams(key);
      result = ruleField.validate({
        key,
        value: params
      });
    }
    return result;
  }
  _findParams(key) {
    return dfs(this.$data, key);
  }
  _createRow() {
    return deepClone(this._assembleCompactParams());
  }
}

export { KeValidator, Rule };
