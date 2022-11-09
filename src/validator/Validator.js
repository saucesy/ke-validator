const Rule = require("./Rule");
const RuleField = require("./RuleField");
const RuleResult = require("./RuleResult");
const {
  get,
  isArray,
  deepClone,
  findMembers,
} = require("../utils");

const {
  OperateException,
  ParameterException,
} = require("../exception");

class Validator {
  constructor() {
    this.data = null;
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
  get(key, defaultValue) {
    if (!this.data) {
      throw new OperateException("禁止在调用validate方法之前调用该方法");
    }
    let value = null;
    for (const el of this._getDataKeys()) {
      value = get(this.data, `${el}.${key}`, defaultValue);
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
   * 1、创建一个RegisterValidator类，继承KEValidator
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
   * @param request - 请求对象
   * @return {Validator}
   */
  validate(request) {
    // 组装request请求对象上下文：{ path、query、body、header }
    const params = this._assembleParams(request);
    // 保存到data中，深拷贝！避免引用造成的潜在性问题
    this._setData(deepClone(params));
    // 查找成员属性和方法
    const memberKeys = findMembers(this, {
      // 根据指定的filter函数
      filter: this._findMembersFilter.bind(this),
    });
    
    // 声明错误集合，将错误信息保存在这中
    const errorMsg = [];
    // 遍历成员属性和方法组成的集合
    for (const key of memberKeys) {
      // 将成员依次放入check函数执行
      const result = this._check(key);
      // 如果未通过提供的验证，result.pass为false
      if (!result.pass) {
        errorMsg.push(result.message);
      }
    }
    // 如果 errorMsg 集合不为空。则抛出异常
    if (errorMsg.length) {
      throw new ParameterException(errorMsg);
    }
    return this;
  }
  
  /**
   * @param data
   * @private
   */
  _setData(data) {
    this.data = data;
  }
  
  /**
   * @param context
   * @return {{path, query: any, header: *, body}}
   * @private
   */
  _assembleParams(context) {
    return {
      path: context.params,
      // 修复[object null prototype]没有原型的问题
      query: JSON.parse(JSON.stringify(context.query)),
      header: context.header,
      body: context.request.body,
    };
  }
  
  /**
   * @param key
   * @return {boolean}
   * @private
   */
  _findMembersFilter(key) {
    // 验证方法是否为 validateXxx 这种格式
    if (/^validate([A-Z]\w+)+$/.test(key)) {
      return true;
    }
    // 如果是数组，数组元素必须是Rule类型
    if (isArray(this[key])) {
      // 遍历数组
      this[key].forEach((rule) => {
        const isRuleType = rule instanceof Rule;
        if (!isRuleType) {
          throw new Error("Verify that the elements of the array must be of type Rule.");
        }
      });
      // 如果没有抛出异常，则通过
      return true;
    }
    return false;
  }
  
  /**
   * @param key
   * @return {{pass}}
   * @private
   */
  _check(key) {
    // 声明结果对象
    let result;
    // 是否为成员方法或者说是否为函数，如果是函数，那么就是自定义的 validateXxx 这种格式的函数
    const isValidateFn = typeof (this[key]) === "function";
    // 该成员变量是方法时
    if (isValidateFn) {
      // 使用try/catch捕获函数执行抛出的异常
      try {
        // 执行
        this[key](this.data);
        // 没有抛出异常，默认为true
        result = new RuleResult(true);
      } catch (error) {
        // 如果抛出了异常，需要在这里捕获
        result = new RuleResult(false, error.message || "参数错误");
      }
    }
    // 该成员变量为属性时
    else {
      // 获取属性对应的值
      const rules = this[key];
      // 实例化RuleField对象
      const ruleField = new RuleField(rules);
      // 通过key（验证器的属性）找到对应（客户端传来的）的值
      const params = this._findParams(key);
      // 校验值
      result = ruleField.validate(params.value);
    }
    if (!result.pass) {
      // 如果是验证函数，则不需要在错误信息前加 属性名
      result.message = `${isValidateFn ? "" : key}${result.message}`;
    }
    return result;
  }
  
  /**
   * 通过指定的key从组装的data属性对象中获取值
   * @param key
   * @return {{path: *[], value}}
   * @private
   */
  _findParams(key) {
    let value;
    const path = [];
    for (const el of this._getDataKeys()) {
      value = get(this.data, `${el}.${key}`);
      if (value) {
        path.push(el, key);
        break;
      }
    }
    return {
      path,
      value,
    };
  }
  
  /**
   * 获取data对象中所有属性的key
   * @return {Array}
   * @private
   */
  _getDataKeys() {
    const dataKeys = Object.keys(this.data);
    this._getDataKeys = function () {
      return dataKeys;
    };
    return this._getDataKeys();
  }
}

module.exports = Validator;
