# 登录引导注册功能实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 在登录失败时显示"还没有账号？去注册"链接，引导用户前往注册页面

**架构：**
- 修改 login.html 添加注册引导链接
- 新增 register.html 注册页面
- 修改 styles/login.css 添加链接样式

**技术栈：** 原生 HTML/CSS/JavaScript

---

## 文件结构

| 文件 | 说明 |
|------|------|
| `login.html` | 修改：添加注册引导链接 |
| `register.html` | 新增：注册页面 |
| `styles/login.css` | 修改：添加注册引导链接样式 |

---

## 任务分解

### Task 1: 修改 login.html 添加注册引导链接

**文件：**
- 修改: `login.html`

**步骤：**

- [ ] **Step 1: 修改 login.html**

在 `</form>` 后、`</div>` (login-card) 前添加注册引导链接：

```html
            <button type="submit" class="login-btn" id="loginBtn">登录</button>
            <div class="error-msg" id="errorMsg"></div>
            <div class="register-guide">
                还没有账号？<a href="register.html">去注册</a>
            </div>
        </form>
    </div>
```

- [ ] **Step 2: 提交**

```bash
git add login.html
git commit -m "feat: 登录页面添加注册引导链接"
```

---

### Task 2: 修改 styles/login.css 添加链接样式

**文件：**
- 修改: `styles/login.css`

**步骤：**

- [ ] **Step 1: 添加 .register-guide 样式**

在 `.error-msg` 样式后添加：

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

- [ ] **Step 2: 提交**

```bash
git add styles/login.css
git commit -m "feat: 添加注册引导链接样式"
```

---

### Task 3: 创建 register.html 注册页面

**文件：**
- 创建: `register.html`

**步骤：**

- [ ] **Step 1: 创建 register.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>用户注册</title>
    <link rel="stylesheet" href="styles/login.css">
</head>
<body>
    <div class="login-card">
        <h1 class="login-title">用户注册</h1>
        <form id="registerForm">
            <div class="form-group">
                <label for="phone">手机号</label>
                <input type="text" id="phone" name="phone" placeholder="请输入手机号" autocomplete="off">
            </div>
            <div class="form-group">
                <label for="password">密码</label>
                <input type="password" id="password" name="password" placeholder="请输入密码">
            </div>
            <div class="form-group">
                <label for="confirmPassword">确认密码</label>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="请再次输入密码">
            </div>
            <button type="submit" class="login-btn" id="registerBtn">注册</button>
            <div class="error-msg" id="errorMsg"></div>
            <div class="register-guide">
                已有账号？<a href="login.html">去登录</a>
            </div>
        </form>
    </div>

    <script>
        (function() {
            var form = document.getElementById('registerForm');
            var registerBtn = document.getElementById('registerBtn');
            var errorMsg = document.getElementById('errorMsg');

            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var phone = document.getElementById('phone').value.trim();
                var password = document.getElementById('password').value;
                var confirmPassword = document.getElementById('confirmPassword').value;

                // 前端验证
                if (!phone) {
                    errorMsg.textContent = '请输入手机号';
                    return;
                }
                if (!password) {
                    errorMsg.textContent = '请输入密码';
                    return;
                }
                if (!confirmPassword) {
                    errorMsg.textContent = '请输入确认密码';
                    return;
                }
                if (password !== confirmPassword) {
                    errorMsg.textContent = '两次输入密码不一致';
                    return;
                }

                errorMsg.textContent = '';
                registerBtn.disabled = true;
                registerBtn.textContent = '注册中...';

                // 调用注册接口
                fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        phone: phone,
                        password: password
                    })
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(res) {
                    if (res.code === '200') {
                        alert('注册成功，请登录');
                        window.location.href = 'login.html';
                    } else {
                        errorMsg.textContent = res.message || '注册失败';
                        registerBtn.disabled = false;
                        registerBtn.textContent = '注册';
                    }
                })
                .catch(function(err) {
                    errorMsg.textContent = '网络异常，请稍后重试';
                    registerBtn.disabled = false;
                    registerBtn.textContent = '注册';
                });
            });
        })();
    </script>
</body>
</html>
```

- [ ] **Step 2: 提交**

```bash
git add register.html
git commit -m "feat: 添加注册页面 register.html"
```

---

## 自检清单

- [ ] login.html 添加了"还没有账号？去注册"链接
- [ ] styles/login.css 添加了 .register-guide 样式
- [ ] register.html 包含手机号、密码、确认密码表单
- [ ] register.html 调用 /api/auth/register 接口
- [ ] register.html 前端验证密码与确认密码一致性
- [ ] register.html 注册成功后跳转 login.html
- [ ] 样式使用 Ant Design 主色 #1890ff
- [ ] 遵循 IIFE 模式避免全局污染

---

**Plan saved to:** `docs/superpowers/plans/2026-04-23-login-guidance-plan.md`
