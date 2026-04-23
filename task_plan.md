# 任务计划

## 项目目标
实现登录页面 login.html、入口页面 index.html 和主页面 main.html

## 文件结构
| 文件 | 说明 |
|------|------|
| `index.html` | 入口页面，检查登录状态并跳转 |
| `login.html` | 登录页面 |
| `main.html` | 登录成功后的主页面（占位） |
| `styles/login.css` | 登录页面样式 |

---

## 任务清单

### Task 1: 创建 index.html 入口页面
- [ ] Step 1: 创建 index.html - 检查 localStorage 中是否存在 token 进行跳转
- [ ] Step 2: git add index.html && git commit -m "feat: 添加入口页面 index.html"

### Task 2: 创建 styles/login.css 登录样式
- [ ] Step 1: 创建 styles/login.css - 包含登录卡片、表单、按钮样式
- [ ] Step 2: git add styles/login.css && git commit -m "feat: 添加登录页面样式 login.css"

### Task 3: 创建 login.html 登录页面
- [ ] Step 1: 创建 login.html - 表单验证、调用 /api/auth/login、记住登录状态
- [ ] Step 2: git add login.html && git commit -m "feat: 添加登录页面 login.html"

### Task 4: 创建 main.html 主页面
- [ ] Step 1: 创建 main.html - 登录成功占位页、退出登录功能
- [ ] Step 2: git add main.html && git commit -m "feat: 添加主页面 main.html"

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
