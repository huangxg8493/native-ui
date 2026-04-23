# 登录页面设计方案

## 1. 概述

实现一个简洁居中卡片式的登录页面，包含手机号+密码登录、记住登录状态功能。

## 2. 文件结构

| 文件 | 说明 |
|------|------|
| `index.html` | 入口页面，检查登录状态并跳转 |
| `login.html` | 登录页面 |
| `main.html` | 登录成功后的主页面（占位） |
| `styles/login.css` | 登录页面样式 |

## 3. 页面设计

### 3.1 index.html（入口页面）

- 页面加载时检查 localStorage 中是否存在 `token`
- 已有 token → 跳转 `main.html`
- 无 token → 跳转 `login.html`

### 3.2 login.html（登录页面）

**布局**：白色卡片垂直居中

**组件**：
- Logo/标题区域
- 手机号输入框（placeholder: "请输入手机号"）
- 密码输入框（placeholder: "请输入密码"，type="password"）
- 记住登录状态复选框
- 登录按钮

**样式**：
- 卡片宽度：360px
- 卡片内边距：40px
- 圆角：8px
- 阴影：0 4px 12px rgba(0,0,0,0.1)
- 主色：#1890ff
- 输入框高度：38px
- 按钮高度：40px

### 3.3 main.html（主页面）

- 简单的占位页面，显示"登录成功"
- 包含退出登录按钮

## 4. 登录流程

```
用户输入手机号、密码 → 点击登录 → 调用 /api/auth/login
    ↓
成功 → 存储 token 到 localStorage → 跳转 main.html
失败 → 显示错误提示
```

## 5. API 调用

**接口**：POST `/api/auth/login`

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
  "data": {
    "token": "string",
    "phone": "string"
  }
}
```

## 6. localStorage 结构

```javascript
{
  "token": "登录令牌",
  "phone": "手机号"
}
```

## 7. 错误处理

| 场景 | 提示信息 |
|------|----------|
| 手机号为空 | "请输入手机号" |
| 密码为空 | "请输入密码" |
| 接口返回错误 | 显示后端返回的 message |
| 网络异常 | "网络异常，请稍后重试" |

## 8. 退出登录

- 清除 localStorage 中的 token 和 phone
- 跳转回 login.html
