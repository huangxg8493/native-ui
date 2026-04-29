# 用户管理页面 HTML 片段化改造

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将用户管理页面从 JS 内嵌模板改为独立 HTML 片段，通过 fetch 加载，实现模块物理分离

**Architecture:** loadModule 支持 HTML 模式（fetch 加载 user.html 片段），user.html 包含完整结构化的 DOM 和 script/css 引用，user.js 仅负责逻辑绑定

**Tech Stack:** 原生 JS（无框架）、fetch API、IIFE 模式

---

## 文件结构

| 文件 | 职责 |
|------|------|
| `html/sys/user.html` | 用户管理页面 HTML 片段（无完整 HTML 结构） |
| `assets/script/user.js` | 用户管理逻辑，移除 HTML_TEMPLATE，绑定已有 DOM |
| `assets/css/user.css` | 用户管理样式（无需修改） |
| `html/main.html` | 扩展 loadModule 支持 HTML 模式 |

---

## 修改详情

### Task 1: 改造 user.html 为 HTML 片段

**文件:** Modify: `html/sys/user.html`

将完整 HTML 结构改为 HTML 片段，移除 `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>` 标签，保留业务 DOM 结构。

**步骤:**

- [ ] **Step 1: 替换为 HTML 片段结构**

将 `html/sys/user.html` 内容替换为：

```html
<div class="container">
    <!-- 搜索栏 -->
    <div class="search-bar">
        <div class="search-bar-row">
            <label>手机号</label>
            <input type="text" id="searchPhone" placeholder="请输入手机号">
            <label style="margin-left:16px">状态</label>
            <select id="searchStatus">
                <option value="">全部</option>
                <option value="Y">正常</option>
                <option value="N">禁用</option>
            </select>
            <button id="queryBtn">查询</button>
        </div>
        <button id="addBtn">+ 新增用户</button>
    </div>

    <!-- 数据表格 -->
    <table id="userTable">
        <thead>
            <tr>
                <th>序号</th><th>手机号</th><th>用户名</th><th>邮箱</th>
                <th>省市</th><th>状态</th><th>创建时间</th><th>操作</th>
            </tr>
        </thead>
        <tbody id="userTableBody"></tbody>
    </table>

    <!-- 分页 -->
    <div class="pagination">
        <span id="pageInfo"></span>
        <select id="pageSizeSelect">
            <option value="5">5条/页</option>
            <option value="10" selected>10条/页</option>
            <option value="20">20条/页</option>
            <option value="50">50条/页</option>
        </select>
        <button id="prevBtn">上一页</button>
        <button id="nextBtn">下一页</button>
    </div>
</div>

<!-- 新增/编辑弹窗 -->
<div id="userModal" class="modal">
    <div class="modal-content">
        <h2 id="modalTitle">新增用户</h2>
        <form id="userForm">
            <input type="hidden" id="formUserId">
            <div class="form-row">
                <label>手机号</label>
                <input type="text" id="formPhone" maxlength="11">
            </div>
            <div class="form-row">
                <label>密码</label>
                <input type="password" id="formPassword">
            </div>
            <div class="form-row">
                <label>状态</label>
                <select id="formStatus">
                    <option value="Y">正常</option>
                    <option value="N">禁用</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" id="cancelBtn">取消</button>
                <button type="submit">确定</button>
            </div>
        </form>
    </div>
</div>

<!-- 分配角色弹窗 -->
<div id="roleModal" class="modal">
    <div class="modal-content">
        <h2 id="roleModalTitle">分配角色</h2>
        <div id="roleList"></div>
        <div class="form-actions">
            <button type="button" id="roleCancelBtn">取消</button>
            <button type="button" id="roleConfirmBtn">确定</button>
        </div>
    </div>
</div>

<!-- Toast 容器 -->
<div id="toast" class="toast" style="display:none"></div>

<link rel="stylesheet" href="../../assets/css/user.css">
<script src="../../assets/script/user.js"></script>
```

---

### Task 2: 重构 user.js 移除模板字符串

**文件:** Modify: `assets/script/user.js`

移除 `HTML_TEMPLATE` 字符串，保留 `bindEvents` 逻辑和 `UserModule` 暴露。

**步骤:**

- [ ] **Step 1: 删除 HTML_TEMPLATE 变量**

删除第 12-70 行的 `HTML_TEMPLATE` 定义：

```javascript
// 删除这部分
var HTML_TEMPLATE = '...';
```

- [ ] **Step 2: 修改 init 方法**

将 `init: function(cont)` 修改为不再设置 `innerHTML`：

```javascript
init: function(cont) {
    container = cont;
    bindEvents();
    queryUsers();
},
```

- [ ] **Step 3: 删除 bindEvents 中的 DOM 查询断言**

`bindEvents` 中所有 `document.getElementById(...)` 调用保持不变（DOM 已由 user.html 提供）。

- [ ] **Step 4: 保持文件路径**

确认第 366 行 `<script src="../../assets/script/user.js">` 与 user.html 路径一致。

---

### Task 3: 扩展 main.html loadModule 支持 HTML 模式

**文件:** Modify: `html/main.html:520-578`

扩展 `loadModule` 函数，当 moduleMap 中配置 `type: 'html'` 时，使用 fetch 加载 HTML 片段。

**步骤:**

- [ ] **Step 1: 在 loadModule 顶部添加 HTML 模式处理逻辑**

找到 `loadModule` 函数（约在 491 行），在获取 `contentEl` 后添加：

```javascript
// 查找模块配置
var moduleMap = {
    'system-user': { type: 'html', html: '../html/sys/user.html' },
    'user': { type: 'html', html: '../html/sys/user.html' }
};

var mod = moduleMap[moduleId];
var contentEl = document.getElementById('tabContent');
var globalVarName = moduleId.split('-').map(function(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}).join('') + 'Module';

// HTML 模式：fetch 加载 HTML 片段
if (mod && mod.type === 'html') {
    console.log('[loadModule] HTML模式加载:', mod.html);
    fetch(mod.html)
        .then(function(resp) {
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            return resp.text();
        })
        .then(function(html) {
            console.log('[loadModule] HTML加载成功，长度:', html.length);
            contentEl.innerHTML = html;
            console.log('[loadModule] 调用模块 init(), globalVarName:', globalVarName);
            console.log('[loadModule] window[globalVarName] 存在:', !!window[globalVarName]);
            // 等待 DOM 解析完成后调用 init
            setTimeout(function() {
                if (window[globalVarName]) {
                    window[globalVarName].init(contentEl);
                }
            }, 0);
        })
        .catch(function(err) {
            console.error('[loadModule] HTML加载失败:', err);
        });
    return;  // 提前返回，不执行下面的 JS 模式
}
```

- [ ] **Step 2: 保留 JS 模式作为回退**

原有的 JS 模式代码保持不变，作为其他模块的默认回退。

**完整 loadModule 函数结构：**

```javascript
function loadModule(moduleId) {
    console.log('[loadModule] 开始加载模块, moduleId:', moduleId);

    var moduleMap = {
        'system-user': { type: 'html', html: '../html/sys/user.html' },
        'user': { type: 'html', html: '../html/sys/user.html' }
    };

    var mod = moduleMap[moduleId];
    var contentEl = document.getElementById('tabContent');
    var globalVarName = moduleId.split('-').map(function(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }).join('') + 'Module';
    console.log('[loadModule] 计算的全局变量名:', globalVarName);

    // HTML 模式
    if (mod && mod.type === 'html') {
        console.log('[loadModule] HTML模式加载:', mod.html);
        fetch(mod.html)
            .then(function(resp) {
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                return resp.text();
            })
            .then(function(html) {
                console.log('[loadModule] HTML加载成功，长度:', html.length);
                contentEl.innerHTML = html;
                setTimeout(function() {
                    console.log('[loadModule] window[globalVarName] 存在:', !!window[globalVarName]);
                    if (window[globalVarName]) {
                        window[globalVarName].init(contentEl);
                    }
                }, 0);
            })
            .catch(function(err) {
                console.error('[loadModule] HTML加载失败:', err);
            });
        return;
    }

    // JS 模式（原逻辑）
    var jsMod = {
        js: '../assets/script/' + moduleId + '.js',
        css: '../assets/css/' + moduleId + '.css'
    };
    // ...原有 JS 加载逻辑...
}
```

---

## 自检清单

- [ ] user.html 转为 HTML 片段，无完整 HTML 结构
- [ ] user.html 中 CSS link 路径为 `../../assets/css/user.css`
- [ ] user.html 中 JS script 路径为 `../../assets/script/user.js`
- [ ] user.js 无 HTML_TEMPLATE 变量
- [ ] user.js 的 init() 不再设置 innerHTML
- [ ] main.html loadModule 支持 type: 'html' 配置
- [ ] fetch 加载失败时有错误日志
- [ ] Tab 关闭后重新打开能正常加载
- [ ] 点击菜单加载 user.html 后 UserModule.init 被调用

---

## 注意事项

1. **路径计算**：user.html 位于 `html/sys/user.html`，相对路径 `../../` 能正确指向 `assets/` 目录
2. **globalVarName**：`user` → `UserModule`，与 user.js 中 `window.UserModule` 一致
3. **bindEvents 依赖**：user.js 中 `bindEvents` 依赖 DOM 元素存在，user.html 必须先完成解析
4. **重复加载**：HTML 模式每次 open 会重新 fetch，不会像 JS 模式有已加载判断（可通过添加已加载标识优化，但不是本次范围）

---

**Plan complete.** 保存于 `docs/superpowers/plans/2026-04-29-user-html-mode.md`

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**