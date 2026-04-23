# 发现项

## 项目背景
- 前端项目，使用原生 HTML/CSS/JavaScript
- Ant Design 风格 UI，主色 #1890ff
- IIFE 模式避免全局污染
- 目前仅有 address.html 和 address.css

## 设计决策
- **布局方案**: 简洁居中卡片式（白色卡片垂直居中）
- **登录字段**: 手机号 + 密码 + 记住登录状态
- **状态存储**: localStorage 存储 token 和 phone
- **入口检查**: index.html 加载时检查 token 决定跳转

## 技术要点
- 使用 fetch 调用 /api/auth/login 接口
- 登录成功存储 token 到 localStorage
- 记住登录状态时保存 phone，回填表单
- 退出登录清除 localStorage 并跳转 login.html
