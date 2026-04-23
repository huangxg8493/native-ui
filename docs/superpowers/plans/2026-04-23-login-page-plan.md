# 登录页面实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 实现登录页面 login.html、入口页面 index.html 和主页面 main.html

**架构：**
- `index.html` 作为入口，检查 localStorage 中的 token 决定跳转
- `login.html` 提供手机号+密码登录，调用 /api/auth/login 接口
- `main.html` 作为登录成功后的目标页面（占位）

**技术栈：** 原生 HTML/CSS/JavaScript、Ant Design 风格 UI（主色 #1890ff）

---

## 文件结构

| 文件 | 说明 |
|------|------|
| `index.html` | 入口页面，检查登录状态并跳转 |
| `login.html` | 登录页面 |
| `main.html` | 登录成功后的主页面（占位） |
| `styles/login.css` | 登录页面样式 |

---

## 任务分解

### Task 1: 创建 index.html 入口页面

**文件：**
- 创建: `index.html`

**步骤：**

- [ ] **Step 1: 创建 index.html**

创建入口页面，检查 localStorage 中是否存在 token：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>加载中...</title>
    <script>
        (function() {
            var token = localStorage.getItem('token');
            if (token) {
                window.location.href = 'main.html';
            } else {
                window.location.href = 'login.html';
            }
        })();
    </script>
</head>
<body>
</body>
</html>
```

- [ ] **Step 2: 提交**

```bash
git add index.html
git commit -m "feat: 添加入口页面 index.html"
```

---

### Task 2: 创建 styles/login.css 登录样式

**文件：**
- 创建: `styles/login.css`

**步骤：**

- [ ] **Step 1: 创建 styles 目录和 login.css**

```css
/* 登录页面样式 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 360px;
}

.login-title {
    text-align: center;
    color: #333;
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 30px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    color: #666;
    font-size: 14px;
    margin-bottom: 8px;
}

.form-group input[type="text"],
.form-group input[type="password"] {
    width: 100%;
    height: 38px;
    padding: 0 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s;
}

.form-group input[type="text"]:focus,
.form-group input[type="password"]:focus {
    border-color: #1890ff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.remember-group {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
}

.remember-group input[type="checkbox"] {
    margin-right: 8px;
    width: 16px;
    height: 16px;
    cursor: pointer;
}

.remember-group label {
    color: #666;
    font-size: 14px;
    cursor: pointer;
    user-select: none;
}

.login-btn {
    width: 100%;
    height: 40px;
    background: #1890ff;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
}

.login-btn:hover {
    background: #40a9ff;
}

.login-btn:active {
    background: #096dd9;
}

.login-btn:disabled {
    background: #d9d9d9;
    cursor: not-allowed;
}

.error-msg {
    color: #ff4d4f;
    font-size: 14px;
    margin-top: 8px;
    text-align: center;
    min-height: 20px;
}
```

- [ ] **Step 2: 提交**

```bash
git add styles/login.css
git commit -m "feat: 添加登录页面样式 login.css"
```

---

### Task 3: 创建 login.html 登录页面

**文件：**
- 创建: `login.html`

**步骤：**

- [ ] **Step 1: 创建 login.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>用户登录</title>
    <link rel="stylesheet" href="styles/login.css">
</head>
<body>
    <div class="login-card">
        <h1 class="login-title">用户登录</h1>
        <form id="loginForm">
            <div class="form-group">
                <label for="phone">手机号</label>
                <input type="text" id="phone" name="phone" placeholder="请输入手机号" autocomplete="off">
            </div>
            <div class="form-group">
                <label for="password">密码</label>
                <input type="password" id="password" name="password" placeholder="请输入密码">
            </div>
            <div class="remember-group">
                <input type="checkbox" id="remember" name="remember">
                <label for="remember">记住登录状态</label>
            </div>
            <button type="submit" class="login-btn" id="loginBtn">登录</button>
            <div class="error-msg" id="errorMsg"></div>
        </form>
    </div>

    <script>
        (function() {
            // 检查是否已登录
            var token = localStorage.getItem('token');
            if (token) {
                window.location.href = 'main.html';
                return;
            }

            // 记住登录状态 - 回填手机号
            var savedPhone = localStorage.getItem('phone');
            if (savedPhone) {
                document.getElementById('phone').value = savedPhone;
                document.getElementById('remember').checked = true;
            }

            var form = document.getElementById('loginForm');
            var loginBtn = document.getElementById('loginBtn');
            var errorMsg = document.getElementById('errorMsg');

            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var phone = document.getElementById('phone').value.trim();
                var password = document.getElementById('password').value;
                var remember = document.getElementById('remember').checked;

                // 前端验证
                if (!phone) {
                    errorMsg.textContent = '请输入手机号';
                    return;
                }
                if (!password) {
                    errorMsg.textContent = '请输入密码';
                    return;
                }

                errorMsg.textContent = '';
                loginBtn.disabled = true;
                loginBtn.textContent = '登录中...';

                // 调用登录接口
                fetch('/api/auth/login', {
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
                        // 登录成功
                        localStorage.setItem('token', res.data.token);
                        if (remember) {
                            localStorage.setItem('phone', phone);
                        } else {
                            localStorage.removeItem('phone');
                        }
                        window.location.href = 'main.html';
                    } else {
                        errorMsg.textContent = res.message || '登录失败';
                        loginBtn.disabled = false;
                        loginBtn.textContent = '登录';
                    }
                })
                .catch(function(err) {
                    errorMsg.textContent = '网络异常，请稍后重试';
                    loginBtn.disabled = false;
                    loginBtn.textContent = '登录';
                });
            });
        })();
    </script>
</body>
</html>
```

- [ ] **Step 2: 提交**

```bash
git add login.html
git commit -m "feat: 添加登录页面 login.html"
```

---

### Task 4: 创建 main.html 主页面

**文件：**
- 创建: `main.html`

**步骤：**

- [ ] **Step 1: 创建 main.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>首页</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #f0f2f5;
            min-height: 100vh;
        }
        .header {
            background: #fff;
            padding: 0 24px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        .header-title {
            font-size: 18px;
            font-weight: 500;
            color: #333;
        }
        .logout-btn {
            padding: 8px 16px;
            background: #fff;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            color: #666;
            transition: all 0.3s;
        }
        .logout-btn:hover {
            color: #ff4d4f;
            border-color: #ff4d4f;
        }
        .content {
            padding: 24px;
        }
        .welcome-card {
            background: #fff;
            border-radius: 8px;
            padding: 48px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        .welcome-card h2 {
            color: #333;
            font-size: 24px;
            margin-bottom: 16px;
        }
        .welcome-card p {
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-title">管理系统</div>
        <button class="logout-btn" id="logoutBtn">退出登录</button>
    </div>
    <div class="content">
        <div class="welcome-card">
            <h2>登录成功</h2>
            <p>欢迎使用管理系统</p>
        </div>
    </div>

    <script>
        (function() {
            // 检查是否已登录
            var token = localStorage.getItem('token');
            if (!token) {
                window.location.href = 'login.html';
                return;
            }

            // 退出登录
            document.getElementById('logoutBtn').addEventListener('click', function() {
                localStorage.removeItem('token');
                localStorage.removeItem('phone');
                window.location.href = 'login.html';
            });
        })();
    </script>
</body>
</html>
```

- [ ] **Step 2: 提交**

```bash
git add main.html
git commit -m "feat: 添加主页面 main.html"
```

---

## 自检清单

- [ ] index.html 检查 token 跳转逻辑
- [ ] login.html 调用 /api/auth/login 接口
- [ ] login.html 记住登录状态功能
- [ ] login.html 表单验证（手机号、密码为空提示）
- [ ] login.html 错误处理（显示后端错误信息、网络异常提示）
- [ ] main.html 退出登录清除 token 并跳转
- [ ] 样式使用 Ant Design 主色 #1890ff
- [ ] 遵循 IIFE 模式避免全局污染

---

**Plan saved to:** `docs/superpowers/plans/2026-04-23-login-page-plan.md`
