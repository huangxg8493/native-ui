# 发现记录

## Home 模块文件重组

### 背景
当前 `home` 模块只有 `assets/script/home.js` 和 `assets/css/home.css`，缺少 `home.html`，与其他模块（如 `user`）的文件组织风格不一致。

### 现有架构
- `main.html` — 登录后主框架，包含顶部导航和 Tab 区域
- `home.js` + `home.css` — 首页模块资源，被 main.html 动态加载
- `home.js` 中 `render()` 函数通过字符串拼接生成 HTML

### 参考模块
- `html/sys/user.html` — HTML 片段风格（其他模块参考）
- `html/login/login.html` — 独立页面风格

### 设计决策
- 采用 A 方案：从 JS render() 提取 HTML 为真实 HTML 片段
- `home.html` 走 HTML 模式加载（type: 'html'），与 user 模块一致

### 参考文档
- `docs/superpowers/specs/2026-05-05-home-module-restructuring-design.md`
- `docs/superpowers/plans/2026-05-05-home-module-restructuring-plan.md`
