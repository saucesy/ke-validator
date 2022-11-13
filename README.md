



# ke-validator V1.5.0

`ke-validator` 是一个适用于`Express`和`Koa`的快速、轻量级验证器。

采用面向对象思想，所有的验证器都基于一个父验证器进行开发。

开发者仅需提供一系列规则或自定义函数，并带上被验证数据源，便能快速校验可信赖的结果。

## Install

> 使用 [npm](https://github.com/npm/npm) 安装

```bash
npm install ke-validator
```

## Usage

### Koa

```bash
npm install koa koa-body ke-validator # 注意Koa需要Node.js 7.6.0+来支持async/await
```

index.js:

```javascript
const Koa = require("koa");
const { koabody } = require("koa-body");
const { Rule, KeValidator } = require("ke-validator");

const app = new Koa();

app.use(koaBody());

app.use((context, next) => {
    try {
        await next();
    } catch(error) {
        context.body = error.message;
    }
}); 

class RegisterValidator extendes KeValidator {
    constructor() {
        super();
        this.username = [
            new Rule({
                name: "isLength",
                message: "长度需要在4~12之间",
                options: {min: 4, max: 12},
            })
        ];
        this.password = [
            new Rule({
                name: "matches",
                message: "未通过指定格式",
                options: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            })
        ];
        this.repassword = function(value, {password}) {
            if(value !== password) {
                throw new Error("两次密码输入不一致，请重新输入");
            }
        }
    }
}

app.use((context) => {
    const v = new RegisterValidator().validate(context.request);
   	context.body = {
        code: 0,
        message: "OK",
        data: {
            username: v.username,
            password: v.body.password,
            repassword: v.get("username")
        }
    }
})

app.listen(3000);
```

### Express

```bash
npm install express ke-validator
```

index.js:

```javascript
const express = require("express");
const { Rule, KeValidator } = require("ke-validator");

const app = express();
app.use(express.json());

app.use((req, resp, next) => {
    try {
        await next();
    } catch(error) {
        resp.send(error.message);
    }
})

class RegisterValidator extendes KeValidator {
    constructor() {
        super();
        this.username = [
            new Rule({
                name: "isLength",
                message: "长度需要在4~12之间",
                options: {min: 4, max: 12},
            })
        ];
        this.password = [
            new Rule({
                name: "matches",
                message: "未通过指定格式",
                options: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            })
        ];
        this.repassword = function(value, {password}) {
            if(value !== password) {
                throw new Error("两次密码输入不一致，请重新输入");
            }
        }
    }
}

app.use((req, resp) => {
    const v = new RegisterValidator().validate(req);
   	const content = {
        code: 0,
        message: "OK",
        data: {
            username: v.username,
            password: v.body.password,
            repassword: v.get("username")
        }
    }
    resp.send(content);
})

app.listen(3000);
```

```bash
node index.js
curl -i http://localhost:3000 -d "username=test&password=1234567&repassword=12345678" 
>> $response
["用户名长度需要在4~12之间", "密码长度需要在8~32之间", "确认密码与原密码不相同"];

curl -i http://localhost:3000 -d "username=test123&password=12345678&repassword=12345678" 
>> $response 
{ 
	code: 0, 
	message: "OK", 
	data: {
        username: "test123", 
        password: "12345678", 
        repassword: "12345678"
	}
}
```

## Features

- 多规则验证

```javascript
// 验证类型为 ”isLength“，当数据未通过 {min: 4, max: 12} 时会抛出 "用户名长度需要在4~12之间" 的错误信息。
new Rule({
    name: "isLength",
    message: "长度需要在4~12之间",
    options: {min: 4, max: 12},
})

// 验证类型为 "matches"， 当数据未通过正则时会抛出 "未通过指定格式" 的错误信息。
new Rule({
    name: "matches",
    message: "未通过指定格式",
    options: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
})
```

- 多方式取值

  - 使用 `get` 方法取值，[查看实现](https://github.com/saucesy/ke-validator/blob/main/src/utils/get.js)

  - 使用 `.` 运算符取值和改值，[查看实现](https://github.com/saucesy/ke-validator/blob/main/src/utils/proxyData.js)

```javascript
context.request = {
    query: {id: "xx"},
    headers: {authorization: "xx"},
    body: {username: "test123", password: "12345678", info: { age: 18, hobbies: [{ name: "code" }] }},
    ......
}

const v = new RegisterValidator().validate(context.request);

// 普通取值，默认跳过 body、headers、query……直接获取下面的值
v.get("id") >> "xx"
v.get("username") >> "test123"

// 还支持获取嵌套对象以及数组对象的值
v.get("info.age") >> 18
v.get("info.hobbies[0].name") ==> "code"

// . 运算符取值
v.username ==> "test123"
v.body.username ==> "test123"

// . 运算符改值
v.username = "test345"
v.body.username ==> "test345"
v.get("username") ==> "test345"
```

- 自动解析并组装请求体所有参数信息

## Extra

- `ke-validator`的验证基于 [validator.js](https://www.npmjs.com/package/validator)，如需进一步使用，请参考。
- `ke-validator`的`validate`方法会自动从传入的参数中解析出需要的数据，假如传入的是参数名为`object`：

| 数据   | 描述                                                     |
| ------ | -------------------------------------------------------- |
| params | 路径参数，会自动从参数 object 中寻找名为 params 的属性   |
| query  | URL访问参数，会自动从参数 object 中寻找名为 query 的属性 |
| body   | 请求体，会自动从参数 object 中寻找名为 body 的属性       |
| header | 请求头，会自动从参数 object 中寻找名为 headers 的属性    |

- 请确保验证器中的属性名存在于传入的参数对象中，否则将搜索不到该验证器属性名对应的值，则会抛出 "字段是必填参数"的错误。
- `ke-validator`在成长中，避免不了些许错误。如果遇见了，欢迎您提交至[issue](https://github.com/saucesy/ke-validator/issues)，我们会尽快修正！

## Tests

测试正在使用`Jest`，要运行测试，请使用:

```bash
npm run test
```

## License (MIT)

```
MIT License

Copyright (c) 2022 saucesy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
