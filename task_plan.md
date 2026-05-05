# Home 模块文件重组实施计划

## 目标

将 home 模块重组为 `html/home/home.html` + `home.js` + `home.css`，与 user 模块风格一致

## 架构

将 `home.js` 中 `render()` 的 HTML 字符串提取为真实 HTML 片段；CSS 文件迁移到 `html/home/` 目录；`main.html` 的 `moduleMap` 添加 home 模块的 HTML 路径，使 home 走 HTML 模式加载。

## 技术栈

原生 HTML/CSS/JS，IIFE 模式

---

## 文件映射

| 文件 | 操作 |
|------|------|
| `html/home/home.html` | 新建：首页 HTML 片段 |
| `html/home/home.css` | 新建：从 assets/css/home.css 迁移 |
| `assets/script/home.js` | 修改：改造 render 函数 |
| `assets/css/home.css` | 删除：已迁移到 html/home/home.css |
| `html/main.html` | 修改：moduleMap 添加 home 条目 |

---

## 任务清单

### Task 1: 创建 `html/home/home.html`

**涉及文件:**
- 新建: `html/home/home.html`

**步骤:**
- [ ] Step 1: 创建 home.html（提取自 home.js render() 函数的 HTML 字符串）
- [ ] Step 2: git add html/home/home.html && git commit -m "feat(home): 创建 home.html 主页模块 HTML 片段"

### Task 2: 创建 `html/home/home.css`

**涉及文件:**
- 新建: `html/home/home.css`

**步骤:**
- [ ] Step 1: 从 assets/css/home.css 读取内容，写入 html/home/home.css
- [ ] Step 2: git add html/home/home.css && git commit -m "feat(home): 迁移 home.css 到 html/home 目录"

### Task 3: 改造 `assets/script/home.js`

**涉及文件:**
- 修改: `assets/script/home.js`

**步骤:**
- [ ] Step 1: render() 函数从拼接 HTML 改为数据绑定（调用 renderUserInfo/renderCalendar/renderNotice/renderTodos）
- [ ] Step 2: 删除 CSS 动态加载逻辑（loadModule 统一处理）
- [ ] Step 3: git add assets/script/home.js && git commit -m "refactor(home): 改造 render 函数，从拼接 HTML 改为数据绑定"

### Task 4: 删除 `assets/css/home.css`

**涉及文件:**
- 删除: `assets/css/home.css`

**步骤:**
- [ ] Step 1: git rm assets/css/home.css
- [ ] Step 2: git commit -m "refactor(home): 删除已迁移的 assets/css/home.css"

### Task 5: 更新 `main.html` 的 moduleMap

**涉及文件:**
- 修改: `html/main.html`

**步骤:**
- [ ] Step 1: 在 moduleMap 中添加 `'home': { type: 'html', html: 'html/home/home.html' }`
- [ ] Step 2: git add html/main.html && git commit -m "feat(main): 注册 home 模块到 moduleMap，走 HTML 模式加载"

---

## 验证步骤

1. 登录系统，确认首页 Tab 能正常打开
2. 检查 Network 面板，确认 `html/home/home.html` 和 `html/home/home.css` 被请求
3. 确认用户信息、日历、公告、代办事项均正常显示
4. 确认新增/编辑/删除代办功能正常
5. 确认新增代办后刷新页面数据仍保留（localStorage）
