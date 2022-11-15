'use strict';

var validator = require('validator');

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct.bind();
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }
  return _construct.apply(null, arguments);
}
function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;
  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;
    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);
      _cache.set(Class, Wrapper);
    }
    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }
    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };
  return _wrapNativeSuper(Class);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function () {};
      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

var RuleResult = /*#__PURE__*/_createClass(function RuleResult(pass) {
  var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  _classCallCheck(this, RuleResult);
  this.pass = pass;
  this.message = message;
});

var Rule = /*#__PURE__*/function () {
  function Rule(_ref) {
    var name = _ref.name,
      message = _ref.message,
      options = _ref.options;
    _classCallCheck(this, Rule);
    this.name = name;
    this.message = message;
    this.options = options;
  }
  _createClass(Rule, [{
    key: "validate",
    value: function validate(field) {
      if (this.name === "isOptional") {
        return new RuleResult(true);
      }
      if (!validator[this.name](field, this.options)) {
        return new RuleResult(false, this.message || "参数错误");
      }
      return new RuleResult(true, "");
    }
  }]);
  return Rule;
}();

var RuleFieldResult = /*#__PURE__*/function (_RuleResult) {
  _inherits(RuleFieldResult, _RuleResult);
  var _super = _createSuper(RuleFieldResult);
  function RuleFieldResult(pass) {
    var _this;
    var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    _classCallCheck(this, RuleFieldResult);
    _this = _super.call(this, pass, message);
    _this.value = value;
    return _this;
  }
  return _createClass(RuleFieldResult);
}(RuleResult);

var RuleField = /*#__PURE__*/function () {
  function RuleField(rules) {
    _classCallCheck(this, RuleField);
    this.rules = rules;
  }
  _createClass(RuleField, [{
    key: "validate",
    value: function validate(_ref) {
      var key = _ref.key,
        value = _ref.value;
      if (!value) {
        var isAllowEmpty = this._allowEmpty();
        if (isAllowEmpty) {
          return new RuleFieldResult(true, "");
        } else {
          return new RuleFieldResult(false, key + " 字段是必填参数");
        }
      }
      var fieldResult = new RuleFieldResult(false);
      var _iterator = _createForOfIteratorHelper(this.rules),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var rule = _step.value;
          var result = rule.validate(value);
          if (!result.pass) {
            fieldResult.value = null;
            fieldResult.message = result.message;
            return fieldResult;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return new RuleFieldResult(true, "", this._convert(value));
    }
  }, {
    key: "_allowEmpty",
    value: function _allowEmpty() {
      var _iterator2 = _createForOfIteratorHelper(this.rules),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var rule = _step2.value;
          if (rule.name === "isOptional") {
            return true;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return false;
    }
  }, {
    key: "_convert",
    value: function _convert(value) {
      var _iterator3 = _createForOfIteratorHelper(this.rules),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var rule = _step3.value;
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
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      return value;
    }
  }]);
  return RuleField;
}();

function get(object, path, defaultValue) {
  if (typeof path !== "string") {
    throw new Error("The path argument must be a string");
  }
  var value = object;
  path = path.replace(/\[(.*?)]/g, ".$1").split(".");
  while (path.length) {
    value = value[path.shift()];
    if (!value) break;
  }
  value = value !== undefined ? value : defaultValue;
  return value;
}

function isObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]" && value !== null;
}

function dfs(object, field) {
  var value = null;
  var _search = function _search(data) {
    if (!isObject(data)) return;
    value = data[field];
    for (var key in data) {
      if (value) break;
      _search(data[key]);
    }
  };
  _search(object);
  return value;
}

function isArray(arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
}

function deepClone(object) {
  if (_typeof(object) !== "object" || object == null) {
    return object;
  }
  if (object instanceof Date) {
    return new Date(object);
  }
  if (object instanceof RegExp) {
    return new RegExp(object);
  }
  var target = new object.__proto__.constructor();
  for (var key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
      target[key] = deepClone(object[key]);
    }
  }
  return target;
}

function isFunction(value) {
  return Object.prototype.toString.call(value) === "[object Function]";
}

function proxyData(vm, target) {
  var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  if (!isObject(target) || !depth) {
    return;
  }
  var _loop = function _loop(key) {
    var value = target[key];
    proxyData(vm, value, --depth);
    Object.defineProperty(vm, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        target[key] = newValue;
      }
    });
  };
  for (var key in target) {
    _loop(key);
  }
}

var TypeException = /*#__PURE__*/function (_Error) {
  _inherits(TypeException, _Error);
  var _super = _createSuper(TypeException);
  function TypeException(message) {
    var _this;
    _classCallCheck(this, TypeException);
    _this = _super.call(this);
    _this.message = message || "类型错误";
    return _this;
  }
  return _createClass(TypeException);
}( /*#__PURE__*/_wrapNativeSuper(Error));

var OperateException = /*#__PURE__*/function (_Error) {
  _inherits(OperateException, _Error);
  var _super = _createSuper(OperateException);
  function OperateException(message) {
    var _this;
    _classCallCheck(this, OperateException);
    _this = _super.call(this);
    _this.message = message || "操作异常";
    return _this;
  }
  return _createClass(OperateException);
}( /*#__PURE__*/_wrapNativeSuper(Error));

var ParameterException = /*#__PURE__*/function (_Error) {
  _inherits(ParameterException, _Error);
  var _super = _createSuper(ParameterException);
  function ParameterException(message) {
    var _this;
    _classCallCheck(this, ParameterException);
    _this = _super.call(this);
    _this.message = message || "参数错误";
    return _this;
  }
  return _createClass(ParameterException);
}( /*#__PURE__*/_wrapNativeSuper(Error));

var KeValidator = /*#__PURE__*/function () {
  function KeValidator() {
    _classCallCheck(this, KeValidator);
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
  _createClass(KeValidator, [{
    key: "get",
    value: function get$1(key) {
      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      if (!this.$data) {
        throw new OperateException("The validate method is not allowed to be called before it is called.");
      }
      var value = null;
      var _iterator = _createForOfIteratorHelper(this.$fields),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var el = _step.value;
          value = get(this.$data, "".concat(el, ".").concat(key), defaultValue);
          if (value) break;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
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
  }, {
    key: "validate",
    value: function validate(object) {
      if (!isObject(object)) {
        throw new TypeException("The request must be an object type.");
      }
      if (object.isValidate) {
        throw new OperateException("Do not validate the same object twice.");
      }
      var params = this._assembleParams(object);
      this._setData(params);
      var memberKeys = this._findMembers();
      var errorMsg = [];
      var _iterator2 = _createForOfIteratorHelper(memberKeys),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var key = _step2.value;
          var result = this._check(key);
          if (!result.pass) {
            errorMsg.push(result.message);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      if (errorMsg.length) {
        throw new ParameterException(errorMsg);
      }
      this._punchMark(object);
      this._attachDataToContext();
      return this;
    }
  }, {
    key: "_setData",
    value: function _setData(data) {
      this.$data = deepClone(data);
    }
  }, {
    key: "_punchMark",
    value: function _punchMark(data) {
      Object.defineProperty(data, "isValidate", {
        value: true
      });
    }
  }, {
    key: "_assembleParams",
    value: function _assembleParams(object) {
      var params = {};
      var _iterator3 = _createForOfIteratorHelper(this.$fields),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var field = _step3.value;
          var value = dfs(object, field);
          if (value) {
            params[field] = value;
          }
          if (field === "query") {
            params[field] = JSON.parse(JSON.stringify(value));
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      return params;
    }
  }, {
    key: "_assembleCompactParams",
    value: function _assembleCompactParams() {
      var _this = this;
      return this.$fields.reduce(function (params, field) {
        return Object.assign(params, _this._findParams(field));
      }, {});
    }
  }, {
    key: "_attachDataToContext",
    value: function _attachDataToContext() {
      proxyData(this, this.$data, 2);
    }
  }, {
    key: "_findMembers",
    value: function _findMembers() {
      var proto = this;
      var members = [];
      while (proto !== KeValidator.prototype) {
        var names = Object.getOwnPropertyNames(proto);
        var _iterator4 = _createForOfIteratorHelper(names),
          _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var name = _step4.value;
            this._findMembersFilter(name) && members.push(name);
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
        proto = proto.__proto__;
      }
      return members;
    }
  }, {
    key: "_findMembersFilter",
    value: function _findMembersFilter(key) {
      if (key === "constructor" || key === "$fields") {
        return false;
      }
      var value = this[key];
      if (isFunction(value)) {
        return true;
      }
      if (isArray(value) && key) {
        var isRuleType = value.every(function (v) {
          return v instanceof Rule;
        });
        if (!isRuleType) {
          throw new Error("Verify that the elements of the array must be of type Rule.");
        }
        return true;
      }
      return false;
    }
  }, {
    key: "_check",
    value: function _check(key) {
      var result;
      if (isFunction(this[key])) {
        try {
          var row = this._createRow();
          this[key](row);
          result = new RuleResult(true);
        } catch (error) {
          result = new RuleResult(false, error.message || "Parameter Error.");
        }
      } else {
        var rules = this[key];
        var ruleField = new RuleField(rules);
        var params = this._findParams(key);
        result = ruleField.validate({
          key: key,
          value: params
        });
      }
      return result;
    }
  }, {
    key: "_findParams",
    value: function _findParams(key) {
      return dfs(this.$data, key);
    }
  }, {
    key: "_createRow",
    value: function _createRow() {
      return deepClone(this._assembleCompactParams());
    }
  }]);
  return KeValidator;
}();

exports.KeValidator = KeValidator;
exports.Rule = Rule;
