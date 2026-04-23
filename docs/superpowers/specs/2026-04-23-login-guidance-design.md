# 登录引导注册功能设计方案

## 1. 概述

用户登录失败时，在登录页面显示"还没有账号？去注册"链接，引导用户前往注册页面。

## 2. 改动内容

### 2.1 login.html 改动

在登录按钮下方添加注册引导链接：

```html
<button type="submit" class="login-btn" id="loginBtn">登录</button>
<div class="error-msg" id="errorMsg"></div>
<div class="register-guide">
    还没有账号？<a href="register.html">去注册</a>
</div>
```

### 2.2 register.html 新增

创建独立的注册页面 `register.html`，包含：
- 手机号输入框
- 密码输入框
- 确认密码输入框
- 注册按钮

## 3. 页面样式

### register.html 样式

复用 `styles/login.css` 中的样式，保持与登录页面一致的卡片风格。

注册引导链接样式：

```css
.register-guide {
    text-align: center;
    margin-top: 16px;
    color: #666;
    font-size: 14px;
}

.register-guide a {
    color: #1890ff;
    text-decoration: none;
}

.register-guide a:hover {
    text-decoration: underline;
}
```

## 4. 注册流程

```
用户填写手机号、密码、确认密码 → 点击注册
    ↓
前端验证：密码与确认密码是否一致
    ↓
调用 POST /api/auth/register 接口
    ↓
成功 → 提示"注册成功，请登录" → 跳转 login.html
失败 → 显示错误信息
```

## 5. API 调用

### 注册接口

**接口**：POST `/api/auth/register`

**请求**：
```json
{
  "phone": "string",
  "password": "string"
}
```

**成功响应**：
```json
{
  "code": "200",
  "message": "成功",
  "data": null
}
```

## 6. 前端验证规则

| 场景 | 提示信息 |
|------|----------|
| 手机号为空 | "请输入手机号" |
| 密码为空 | "请输入密码" |
| 确认密码为空 | "请输入确认密码" |
| 密码与确认密码不一致 | "两次输入密码不一致" |

## 7. 文件结构

| 文件 | 说明 |
|------|------|
| `login.html` | 修改：添加注册引导链接 |
| `register.html` | 新增：注册页面 |
| `styles/login.css` | 修改：添加注册引导链接样式 |
