# Home 模块文件重组实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 home 模块重组为 `html/home/home.html` + `home.js` + `home.css`，与 user 模块风格一致

**Architecture:** 将 `home.js` 中 `render()` 的 HTML 字符串提取为真实 HTML 片段；CSS 文件迁移到 `html/home/` 目录；`main.html` 的 `moduleMap` 添加 home 模块的 HTML 路径，使 home 走 HTML 模式加载。

**Tech Stack:** 原生 HTML/CSS/JS，IIFE 模式

---

## 文件变更总览

- 创建: `html/home/home.html`
- 创建: `html/home/home.css`
- 修改: `assets/script/home.js`
- 删除: `assets/css/home.css`
- 修改: `html/main.html` (moduleMap)

---

## Task 1: 创建 `html/home/home.html`

**Files:**
- 创建: `html/home/home.html`

从 `home.js` 的 `render()` 函数中提取 HTML 字符串为真实 HTML 片段。包含所有区块：`user-info`、`calendar-block`、`notice-block`、`todo-block`、`todoModal` 弹窗。id 保持不变，初始内容为空。

- [ ] **Step 1: 创建 `html/home/home.html`**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>首页</title>
</head>
<body>
    <div class="home-container">
        <div class="home-left">
            <div class="user-info">
                <div class="user-avatar" id="homeUserAvatar">?</div>
                <div class="user-details">
                    <div class="user-name" id="homeUserName">加载中...</div>
                    <div class="user-phone" id="homeUserPhone"></div>
                </div>
            </div>
            <div class="calendar-block">
                <div class="section-title">日历</div>
                <div class="calendar-header">
                    <span class="calendar-title" id="calendarTitle"></span>
                </div>
                <div class="calendar-grid" id="calendarGrid"></div>
            </div>
            <div class="notice-block">
                <div class="section-title">公告</div>
                <ul class="notice-list" id="noticeList"></ul>
            </div>
        </div>
        <div class="home-right">
            <div class="todo-block">
                <div class="todo-header">
                    <div class="section-title" style="margin-bottom:0;border:none;padding-bottom:0">待办事项</div>
                    <button class="todo-add-btn" id="todoAddBtn" data-action="add">+ 新增</button>
                </div>
                <div class="todo-list" id="todoList"></div>
            </div>
        </div>
    </div>
    <div class="modal-overlay" id="todoModal">
        <div class="modal-box">
            <div class="modal-title" id="modalTitle">新增待办</div>
            <div class="modal-form">
                <div class="form-group">
                    <label class="form-label">标题</label>
                    <input type="text" class="form-input" id="todoTitleInput" placeholder="请输入待办标题">
                </div>
                <div class="form-group">
                    <label class="form-label">内容</label>
                    <textarea class="form-input" id="todoContentInput" placeholder="请输入待办内容"></textarea>
                </div>
            </div>
            <div class="modal-buttons">
                <button class="btn-cancel" id="todoCancelBtn" data-action="cancel">取消</button>
                <button class="btn-primary" id="todoSubmitBtn" data-action="submit">确定</button>
            </div>
        </div>
    </div>
</body>
</html>
```

- [ ] **Step 2: 提交**

```bash
git add html/home/home.html
git commit -m "feat(home): 创建 home.html 主页模块 HTML 片段"
```

---

## Task 2: 创建 `html/home/home.css`

**Files:**
- 创建: `html/home/home.css`

将 `assets/css/home.css` 整个文件内容迁移到 `html/home/home.css`。

- [ ] **Step 1: 读取并创建 `html/home/home.css`**

从 `assets/css/home.css` 读取全部内容，写入 `html/home/home.css`（内容即 `home.css` 原样迁移，无修改）

- [ ] **Step 2: 提交**

```bash
git add html/home/home.css
git commit -m "feat(home): 迁移 home.css 到 html/home 目录"
```

---

## Task 3: 改造 `assets/script/home.js`

**Files:**
- 修改: `assets/script/home.js`

改动点：
1. `render()` 函数从拼接 HTML 字符串改为初始化已存在的 HTML 元素（数据绑定）
2. 删除 CSS 加载逻辑（不再动态创建 `<link>` 标签加载 CSS）
3. `container.innerHTML = ...` 整段替换为各子区域的 `innerHTML` 赋值

- [ ] **Step 1: 修改 `render()` 函数**

将 `render()` 函数中 `container.innerHTML = '...'` 大段 HTML 字符串替换为：

```js
// 渲染整个首页
function render() {
    // 渲染用户信息
    renderUserInfo();
    // 渲染日历
    renderCalendar();
    // 渲染公告
    renderNotice();
    // 渲染代办列表
    renderTodos();
    // 绑定事件
    bindEvents();
}
```

对应的 `renderUserInfo()`、`renderCalendar()`、`renderNotice()`、`renderTodos()` 函数内部逻辑不变，只是原来从 `container` 变量查找元素改为直接从 `document` 查找（如 `getElementById('homeUserAvatar')` 等）。

同时删除 `render()` 函数开头这段 CSS 加载逻辑：
```js
// 防止 CSS 重复加载
if (!document.querySelector('link[href*="home.css"]')) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '../assets/css/home.css';
    document.head.appendChild(link);
}
```

- [ ] **Step 2: 提交**

```bash
git add assets/script/home.js
git commit -m "refactor(home): 改造 render 函数，从拼接 HTML 改为数据绑定"
```

---

## Task 4: 删除 `assets/css/home.css`

**Files:**
- 删除: `assets/css/home.css`

- [ ] **Step 1: 删除文件**

```bash
git rm assets/css/home.css
```

- [ ] **Step 2: 提交**

```bash
git commit -m "refactor(home): 删除已迁移的 assets/css/home.css"
```

---

## Task 5: 更新 `main.html` 的 `moduleMap`

**Files:**
- 修改: `html/main.html` (moduleMap 配置)

在 `loadModule` 函数的 `moduleMap` 对象中添加 home 模块的 HTML 路径：

```js
var moduleMap = {
    'user': { type: 'html', html: '../html/sys/user.html' },
    'home': { type: 'html', html: 'html/home/home.html' }  // 新增
};
```

- [ ] **Step 1: 修改 `html/main.html` 的 moduleMap**

在 `html/main.html` 第 529 行附近 `moduleMap` 对象中新增 `home` 条目。

- [ ] **Step 2: 提交**

```bash
git add html/main.html
git commit -m "feat(main): 注册 home 模块到 moduleMap，走 HTML 模式加载"
```

---

## 验证步骤

完成所有任务后，验证方式：

1. 登录系统，确认首页 Tab 能正常打开
2. 检查 Network 面板，确认 `html/home/home.html` 和 `html/home/home.css` 被请求
3. 确认用户信息、日历、公告、代办事项均正常显示
4. 确认新增/编辑/删除代办功能正常
5. 确认新增代办后刷新页面数据仍保留（localStorage）
