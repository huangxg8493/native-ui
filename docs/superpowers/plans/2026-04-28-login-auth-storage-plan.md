# 登录认证信息存储实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 登录成功后存储 token、phone、user、roles、menus 到 localStorage；退出登录时清除全部认证信息

**Architecture:** 修改 login.html 登录成功回调和 main.html 登出回调，使用 localStorage 存储和清除认证数据

**Tech Stack:** 原生 HTML/JavaScript，localStorage

---

## 文件结构

- 修改: `html/login/login.html` — 登录成功存储 user、roles、menus
- 修改: `html/main.html` — 登出时清除 user、roles、menus

---

## Task 1: 更新 login.html 登录成功存储逻辑

**Files:**
- Modify: `html/login/login.html:129-138`

- [ ] **Step 1: 更新登录成功回调代码**

将原代码：
```js
if (res.code === '000000') {
    // 登录成功
    localStorage.setItem('token', res.data.token);
    if (remember) {
        localStorage.setItem('phone', phone);
    } else {
        localStorage.removeItem('phone');
    }
    window.location.href = '../main.html';
}
```

替换为：
```js
if (res.code === '000000') {
    // 登录成功，存储认证信息
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('phone', res.data.phone);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('roles', JSON.stringify(res.data.roles));
    localStorage.setItem('menus', JSON.stringify(res.data.menus));
    if (!remember) {
        localStorage.removeItem('phone');
    }
    window.location.href = '../main.html';
}
```

- [ ] **Step 2: 提交代码**

```bash
git add html/login/login.html
git commit -m "feat: 登录成功存储用户、角色、菜单信息"
```

---

## Task 2: 更新 main.html 登出逻辑

**Files:**
- Modify: `html/main.html:89-93`

- [ ] **Step 1: 更新登出函数，清除全部认证信息**

将原代码：
```js
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('token');
    localStorage.removeItem('phone');
    window.location.href = 'login/login.html';
});
```

替换为：
```js
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('token');
    localStorage.removeItem('phone');
    localStorage.removeItem('user');
    localStorage.removeItem('roles');
    localStorage.removeItem('menus');
    window.location.href = 'login/login.html';
});
```

- [ ] **Step 2: 提交代码**

```bash
git add html/main.html
git commit -m "feat: 退出登录清除用户、角色、菜单信息"
```

---

## 验证步骤

1. 打开 login.html，输入正确账号密码登录
2. 打开浏览器 DevTools → Application → Local Storage，确认以下 key 存在：
   - `token` — JWT 令牌
   - `phone` — 登录手机号
   - `user` — 用户信息 JSON 对象
   - `roles` — 角色列表 JSON 数组
   - `menus` — 菜单树 JSON 数组
3. 点击首页"退出登录"按钮
4. 再次打开 DevTools，确认以上全部 key 已被清除