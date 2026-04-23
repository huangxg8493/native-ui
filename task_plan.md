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
- [x] Step 1: 创建 index.html - 检查 localStorage 中是否存在 token 进行跳转
- [x] Step 2: git add index.html && git commit -m "feat: 添加入口页面 index.html"

### Task 2: 创建 styles/login.css 登录样式
- [x] Step 1: 创建 styles/login.css - 包含登录卡片、表单、按钮样式
- [x] Step 2: git add styles/login.css && git commit -m "feat: 添加登录页面样式 login.css"

### Task 3: 创建 login.html 登录页面
- [x] Step 1: 创建 login.html - 表单验证、调用 /api/auth/login、记住登录状态
- [x] Step 2: git add login.html && git commit -m "feat: 添加登录页面 login.html"

### Task 4: 创建 main.html 主页面
- [x] Step 1: 创建 main.html - 登录成功占位页、退出登录功能
- [x] Step 2: git add main.html && git commit -m "feat: 添加主页面 main.html"

---

## 自检清单
- [x] index.html 检查 token 跳转逻辑
- [x] login.html 调用 /api/auth/login 接口
- [x] login.html 记住登录状态功能
- [x] login.html 表单验证（手机号、密码为空提示）
- [x] login.html 错误处理（显示后端错误信息、网络异常提示）
- [x] main.html 退出登录清除 token 并跳转
- [x] 样式使用 Ant Design 主色 #1890ff
- [x] 遵循 IIFE 模式避免全局污染

---

## 新增任务：登录引导注册功能

### Task 1: 修改 login.html 添加注册引导链接
- [ ] Step 1: 修改 login.html - 在登录按钮下方添加"还没有账号？去注册"链接
- [ ] Step 2: git add login.html && git commit -m "feat: 登录页面添加注册引导链接"

### Task 2: 修改 styles/login.css 添加链接样式
- [ ] Step 1: 添加 .register-guide 样式 - 包含链接文字样式和 hover 效果
- [ ] Step 2: git add styles/login.css && git commit -m "feat: 添加注册引导链接样式"

### Task 3: 创建 register.html 注册页面
- [ ] Step 1: 创建 register.html - 包含手机号、密码、确认密码表单和注册逻辑
- [ ] Step 2: git add register.html && git commit -m "feat: 添加注册页面 register.html"

## 新增自检清单
- [ ] login.html 添加了"还没有账号？去注册"链接
- [ ] styles/login.css 添加了 .register-guide 样式
- [ ] register.html 包含手机号、密码、确认密码表单
- [ ] register.html 调用 /api/auth/register 接口
- [ ] register.html 前端验证密码与确认密码一致性
- [ ] register.html 注册成功后跳转 login.html

