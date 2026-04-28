# 登录认证信息存储设计

**日期：** 2026-04-28

**需求：** 根据登录接口响应，更新 login.html 存储逻辑，将用户信息、角色信息、菜单信息存入 localStorage

---

## 1. 背景

当前 login.html 仅存储 token 和 phone（记住登录时）。根据新接口文档，登录成功响应包含完整的 user、roles、menus 数据，需要一并存储供后续页面使用。

---

## 2. 存储结构

采用**分散存储**方案，按字段分别存入 localStorage：

| Key | 存储方式 | 说明 |
|-----|---------|------|
| `token` | 明文字符串 | JWT 令牌 |
| `phone` | 明文字符串 | 登录手机号 |
| `user` | JSON.stringify | 用户信息对象 |
| `roles` | JSON.stringify | 角色列表数组 |
| `menus` | JSON.stringify | 菜单树数组 |

**"记住登录"行为：** 仅记住 phone 字段，user/roles/menus 在每次登录后重新存储

---

## 3. 更新范围

### 3.1 login.html

**位置：** `html/login/login.html` 登录成功回调（约第129行）

**逻辑：** 响应码 `000000` 时执行存储

```js
if (res.code === '000000') {
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

### 3.2 main.html

**位置：** `html/main.html` 退出登录回调（约第89行）

**逻辑：** 清除全部认证相关 key

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

---

## 4. 错误码处理

| 错误码 | 说明 | 前端行为 |
|--------|------|---------|
| `000000` | 成功 | 存储数据，跳转 main.html |
| `101001` | 用户未注册 | 显示错误信息 |
| `101002` | 用户已禁用 | 显示错误信息 |
| `101003` | 密码错误 | 显示错误信息 |

---

## 5. 其他页面读取方式

后续页面获取认证信息：

```js
var user = JSON.parse(localStorage.getItem('user'));
var roles = JSON.parse(localStorage.getItem('roles'));
var menus = JSON.parse(localStorage.getItem('menus'));
```

---

## 6. 方案对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| 分散存储（采用） | 按需读取，逻辑清晰 | key 较多 |
| 集中存储 | 一个 key 便于管理 | 获取单字段需解析 |
| 仅存 token | 数据量小 | 每次刷新需重新获取用户信息 |