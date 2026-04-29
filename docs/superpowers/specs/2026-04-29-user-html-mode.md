# 用户管理页面 HTML 片段化改造 - 设计文档

**日期:** 2026-04-29
**状态:** 设计完成，等待实施

---

## 一、背景

当前架构中 `html/sys/user.html` 没有被用到。用户管理页面实际使用的是 `user.js` 中的内嵌 `HTML_TEMPLATE` 模板，通过 `UserModule.init(container)` 注入到 `#tabContent`。

```
菜单点击 → TabManager.open('user') → loadModule('user')
                                      ↓
                    user.js 中的 HTML_TEMPLATE 字符串
                    → container.innerHTML = HTML_TEMPLATE
```

**问题：**
1. `user.html` 文件存在但未被使用
2. JS 文件中包含大量 HTML 字符串，不利于维护
3. HTML 结构与 JS 逻辑耦合，无法独立编辑/预览

---

## 二、设计目标

将用户管理页面从 JS 内嵌模板改为独立 HTML 片段，通过 fetch 加载，实现模块物理分离。

---

## 三、整体架构

```
菜单点击 → TabManager.open('user') → loadModule('user')
                                      ↓
                              moduleMap 查找
                                      ↓
         ┌─────────────────────────────────────────┐
         │  HTML模式（user）：                     │
         │  1. fetch(user.html) 获取HTML片段       │
         │  2. 注入到 #tabContent                 │
         │  3. user.html 中的 link 加载 CSS       │
         │  4. user.html 中的 script 加载 JS       │
         │  5. UserModule.init() 绑定事件          │
         └─────────────────────────────────────────┘
```

---

## 四、涉及修改的文件

| 文件 | 修改内容 |
|------|----------|
| `html/sys/user.html` | 转为 HTML 片段，移除完整 HTML 结构（DOCTYPE/html/head/body） |
| `assets/css/user.css` | 无需修改（路径已正确）|
| `assets/script/user.js` | 移除 HTML_TEMPLATE，直接绑定已有 DOM 事件 |
| `html/main.html` | 修改 loadModule 支持 HTML 模式 |

---

## 五、详细设计

### 5.1 user.html → 转为 HTML 片段

**当前结构**（完整 HTML）：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>用户管理</title>
    <link rel="stylesheet" href="../../assets/css/user.css">
</head>
<body>
    <div class="container" id="userManagementApp">
        ...
    </div>
    <script src="../../assets/script/user.js"></script>
</body>
</html>
```

**修改为**（HTML 片段）：
```html
<div class="container">
    <!-- 搜索栏 -->
    <div class="search-bar">...</div>

    <!-- 数据表格 -->
    <table id="userTable">...</table>

    <!-- 分页 -->
    <div class="pagination">...</div>
</div>

<!-- 新增/编辑弹窗 -->
<div id="userModal" class="modal">...</div>

<!-- 分配角色弹窗 -->
<div id="roleModal" class="modal">...</div>

<!-- Toast 容器 -->
<div id="toast" class="toast" style="display:none"></div>

<link rel="stylesheet" href="../../assets/css/user.css">
<script src="../../assets/script/user.js"></script>
```

**要点：**
- 移除 `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>` 标签
- 保留 `.container` 和所有弹窗（userModal、roleModal）
- CSS 通过 link 标签引入，路径：`../../assets/css/user.css`
- JS 通过 script 标签引入，路径：`../../assets/script/user.js`
- link 和 script 标签放在 HTML 片段底部

### 5.2 user.js → 移除模板字符串

**当前**：
```javascript
// HTML 模板字符串（约60行）
var HTML_TEMPLATE = '<div class="container">...</div>';

window.UserModule = {
    init: function(cont) {
        container = cont;
        container.innerHTML = HTML_TEMPLATE;  // 使用模板
        bindEvents();
        queryUsers();
    }
};
```

**修改为**：
```javascript
// 不再有 HTML_TEMPLATE，DOM 已由 user.html 提供

window.UserModule = {
    init: function(cont) {
        container = cont;
        // 直接绑定已有 DOM 的事件（DOM 已由 user.html 渲染）
        bindEvents();
        queryUsers();
    },
    refresh: function() { queryUsers(); },
    destroy: function() {}  // 暂无清理需求
};
```

**关键变化：**
- 删除 `HTML_TEMPLATE` 变量（约60行代码）
- `init()` 不再设置 `innerHTML`，DOM 已存在
- `bindEvents()` 中的 `getElementById` 继续正常工作（DOM 已就绪）
- 移除 `user.js` 中的 CSS 加载逻辑（由 user.html 的 link 标签加载）

### 5.3 main.html → 修改 loadModule 支持 HTML 模式

**当前逻辑**：
```javascript
function loadModule(moduleId) {
    var moduleMap = {
        'system-user': { js: '../assets/script/user.js', css: '../assets/css/user.css' }
    };
    var mod = moduleMap[moduleId] || {
        js: '../assets/script/' + moduleId + '.js',
        css: '../assets/css/' + moduleId + '.css'
    };
    // 加载 CSS 和 JS，JS 中模板渲染到 container
}
```

**修改为**：
```javascript
function loadModule(moduleId) {
    var moduleMap = {
        'system-user': { type: 'html', html: '../html/sys/user.html' },
        'user': { type: 'html', html: '../html/sys/user.html' }
    };

    var mod = moduleMap[moduleId];
    var contentEl = document.getElementById('tabContent');
    var globalVarName = moduleId.split('-').map(function(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }).join('') + 'Module';

    // HTML 模式
    if (mod && mod.type === 'html') {
        fetch(mod.html)
            .then(function(resp) { return resp.text(); })
            .then(function(html) {
                contentEl.innerHTML = html;
                setTimeout(function() {
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

    // JS 模式（其他模块保持原有逻辑）
    var jsMod = moduleMap[moduleId] || {
        js: '../assets/script/' + moduleId + '.js',
        css: '../assets/css/' + moduleId + '.css'
    };
    // ...原有 JS 加载逻辑...
}
```

**关键变化：**
- moduleMap 中 `user` 配置 `{ type: 'html', html: '...' }`
- 检测到 `type: 'html'` 时使用 fetch 加载
- HTML 模式直接 return，不执行 JS 模式代码

### 5.4 moduleMap 配置

```javascript
var moduleMap = {
    'system-user': { type: 'html', html: '../html/sys/user.html' },
    'user': { type: 'html', html: '../html/sys/user.html' },
    // 其他现有模块保持 JS 模式：{ js: '...', css: '...' }
};
```

### 5.5 路径映射汇总

| 上下文 | 资源 | 路径 |
|--------|------|------|
| main.html 加载 user.html | user.html | `../html/sys/user.html` |
| user.html 加载 CSS | user.css | `../../assets/css/user.css` |
| user.html 加载 JS | user.js | `../../assets/script/user.js` |
| loadModule globalVarName | user → UserModule | `UserModule` |

---

## 六、执行顺序

1. **修改 `html/sys/user.html`** - 转为 HTML 片段
2. **修改 `assets/script/user.js`** - 移除模板，保留事件绑定
3. **修改 `html/main.html`** - 扩展 loadModule 支持 HTML 模式

---

## 七、注意事项

1. **user.html 中 script 标签的路径**：`../../assets/script/user.js`（相对于 `html/sys/user.html` 到 `assets/script/`）
2. **user.html 中 link 标签的路径**：`../../assets/css/user.css`
3. **loadModule 中的 globalVarName 计算**：`user` → `UserModule`，与 user.js 中定义一致
4. **user.js 中 bindEvents** 直接操作 DOM 元素（ID 已存在于 user.html 中）
5. **Tab 关闭时需清理**：如果 user.js 有定时器或事件绑定在 document 上，需在 destroy 中清理（本方案暂不实现）

---

## 八、测试验证清单

- [ ] 点击"用户管理"菜单，Tab 正常打开，内容正确显示
- [ ] 关闭 Tab 后重新点击，Tab 正常打开
- [ ] 查询/新增/编辑/删除/分配角色功能正常
- [ ] 分页切换正常
- [ ] 样式与 address.html 一致
- [ ] 弹窗能正常打开和关闭

---

## 九、未来优化方向（不在本次范围）

1. 增加已加载标识，避免重复 fetch
2. user.js 的 destroy() 实现清理逻辑
3. 其他模块（address）也迁移到 HTML 模式
4. 公共 CSS 提取为单独文件