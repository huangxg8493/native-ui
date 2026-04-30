# 首页实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 main.html 中实现首页 Tab，左侧 30% 展示用户信息/日历/公告，右侧 70% 展示待办事项 CRUD

**Architecture:** 首页作为 TabManager 中的一个 Tab，渲染到 `#tabContent` 区域。模块独立加载，复用现有 `loadModule` 约定路径机制。

**Tech Stack:** 原生 JS (IIFE)，localStorage 存储，TabManager 动态渲染

---

## 文件结构

| 文件 | 说明 |
|------|------|
| `assets/script/home.js` | 新建：首页模块，渲染左侧三区块 + 右侧代办 |
| `assets/css/home.css` | 新建：首页样式 |
| `assets/script/tab-manager.js` | 修改：增加不可关闭 Tab 支持 |
| `html/main.html` | 修改：注册首页 Tab，预留容器样式 |

---

### Task 1: 创建首页样式 `assets/css/home.css`

**Files:**
- Create: `assets/css/home.css`

- [ ] **Step 1: 创建文件**

```css
/* 首页样式 - 简洁商务风格 */

.home-container {
    display: flex;
    height: 100%;
    background: #f0f2f5;
}

/* 左侧区域 */
.home-left {
    width: 30%;
    min-width: 280px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: #fff;
    border-right: 1px solid #e8e8e8;
    overflow-y: auto;
}

/* 右侧区域 */
.home-right {
    flex: 1;
    padding: 16px;
    display: flex;
    flex-direction: column;
    background: #fff;
    overflow-y: auto;
}

/* 用户信息区块 */
.user-info {
    padding: 16px;
    background: #fafafa;
    border-radius: 8px;
    border: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #1890ff;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    flex-shrink: 0;
}

.user-details {
    flex: 1;
    overflow: hidden;
}

.user-name {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
}

.user-phone {
    font-size: 13px;
    color: #999;
}

/* 日历区块 */
.calendar-block {
    padding: 16px;
    background: #fafafa;
    border-radius: 8px;
    border: 1px solid #e8e8e8;
}

.section-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e8e8e8;
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.calendar-title {
    font-size: 14px;
    color: #333;
    font-weight: 500;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    text-align: center;
}

.calendar-weekday {
    font-size: 12px;
    color: #999;
    padding: 4px 0;
}

.calendar-day {
    font-size: 12px;
    color: #333;
    padding: 6px 4px;
    border-radius: 4px;
    cursor: default;
}

.calendar-day.other-month {
    color: #ccc;
}

.calendar-day.today {
    background: #1890ff;
    color: #fff;
    font-weight: 600;
}

/* 公告区块 */
.notice-block {
    padding: 16px;
    background: #fafafa;
    border-radius: 8px;
    border: 1px solid #e8e8e8;
    flex: 1;
    overflow-y: auto;
}

.notice-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.notice-item {
    padding: 10px 8px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 13px;
    color: #666;
    display: flex;
    align-items: center;
}

.notice-item:last-child {
    border-bottom: none;
}

.notice-item::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #1890ff;
    border-radius: 50%;
    margin-right: 8px;
    flex-shrink: 0;
}

.notice-empty {
    color: #999;
    font-size: 13px;
    text-align: center;
    padding: 20px 0;
}

/* 代办事项区块 */
.todo-block {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.todo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.todo-add-btn {
    padding: 6px 16px;
    background: #1890ff;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.2s;
}

.todo-add-btn:hover {
    background: #40a9ff;
}

.todo-list {
    flex: 1;
    overflow-y: auto;
}

.todo-item {
    display: flex;
    align-items: flex-start;
    padding: 12px;
    background: #fafafa;
    border-radius: 8px;
    border: 1px solid #e8e8e8;
    margin-bottom: 10px;
    transition: border-color 0.2s;
}

.todo-item:hover {
    border-color: #1890ff;
}

.todo-item.completed {
    opacity: 0.6;
}

.todo-item.completed .todo-title {
    text-decoration: line-through;
}

.todo-checkbox {
    width: 18px;
    height: 18px;
    margin-right: 12px;
    margin-top: 2px;
    cursor: pointer;
    accent-color: #1890ff;
}

.todo-content {
    flex: 1;
    overflow: hidden;
}

.todo-title {
    font-size: 14px;
    color: #333;
    margin-bottom: 4px;
    word-break: break-word;
}

.todo-text {
    font-size: 12px;
    color: #999;
    word-break: break-word;
}

.todo-actions {
    display: flex;
    gap: 8px;
    margin-left: 8px;
}

.todo-edit-btn,
.todo-delete-btn {
    padding: 4px 8px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: opacity 0.2s;
}

.todo-edit-btn {
    background: #faad14;
    color: #fff;
}

.todo-edit-btn:hover {
    opacity: 0.8;
}

.todo-delete-btn {
    background: #ff4d4f;
    color: #fff;
}

.todo-delete-btn:hover {
    opacity: 0.8;
}

.todo-empty {
    color: #999;
    font-size: 13px;
    text-align: center;
    padding: 40px 0;
}

/* 新增/编辑弹窗 */
.modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.45);
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-overlay.show {
    display: flex;
}

.modal-box {
    background: #fff;
    border-radius: 8px;
    padding: 24px;
    min-width: 400px;
    max-width: 500px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.modal-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
}

.modal-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-label {
    font-size: 13px;
    color: #666;
}

.form-input {
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
}

.form-input:focus {
    border-color: #1890ff;
}

textarea.form-input {
    min-height: 80px;
    resize: vertical;
}

.modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
}

.btn-cancel {
    padding: 8px 20px;
    border: 1px solid #d9d9d9;
    background: #fff;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    color: #666;
}

.btn-cancel:hover {
    color: #333;
    border-color: #333;
}

.btn-primary {
    padding: 8px 20px;
    border: none;
    background: #1890ff;
    color: #fff;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
}

.btn-primary:hover {
    background: #40a9ff;
}
```

- [ ] **Step 2: 提交**

```bash
git add assets/css/home.css
git commit -m "feat(home): 创建首页样式文件"
```

---

### Task 2: 修改 TabManager 支持不可关闭 Tab

**Files:**
- Modify: `assets/script/tab-manager.js:1-82`

- [ ] **Step 1: 读取当前文件确认内容**

```javascript
/**
 * TabManager - SPA Tab 切换管理器
 * 管理 Tab 的打开、关闭、激活，以及 Tab 栏和内容的渲染
 */
(function() {
    window.TabManager = {
        tabs: [],        // { id, title, renderFn }
        activeId: null,

        // 注册一个 Tab（但不打开）
        register: function(id, title, renderFn) {
            // 已在 tabs 中则不重复注册
            if (this.tabs.some(function(t) { return t.id === id; })) return;
            this.tabs.push({ id: id, title: title, renderFn: renderFn });
        },

        // 打开/激活 Tab
        open: function(id) {
            var tab = this.tabs.find(function(t) { return t.id === id; });
            if (!tab) return;
            this.activeId = id;

            // 隐藏欢迎页
            var welcome = document.getElementById('welcomeContent');
            if (welcome) welcome.style.display = 'none';

            this.render();
            tab.renderFn();
        },

        // 关闭 Tab
        close: function(id) {
            var idx = this.tabs.findIndex(function(t) { return t.id === id; });
            if (idx === -1) return;
            this.tabs.splice(idx, 1);
            if (this.activeId === id) {
                // 激活最近一个 Tab 或回到欢迎页
                if (this.tabs.length > 0) {
                    var lastTab = this.tabs[this.tabs.length - 1];
                    this.activeId = lastTab.id;
                    this.render();
                    lastTab.renderFn();
                } else {
                    this.activeId = null;
                    this.render();
                    this.showWelcome();
                }
            } else {
                this.render();
            }
        },

        // 渲染 Tab 栏
        render: function() {
            var container = document.getElementById('tabBar');
            if (!container) return;
            var html = '';
            this.tabs.forEach(function(tab) {
                var active = tab.id === TabManager.activeId ? 'active' : '';
                html += '<div class="tab-item ' + active + '" data-id="' + tab.id + '">' +
                    '<span class="tab-title">' + tab.title + '</span>' +
                    '<span class="tab-close" data-id="' + tab.id + '">×</span>' +
                    '</div>';
            });
            container.innerHTML = html;

            // 内容区显示/隐藏
            var contentArea = document.getElementById('tabContent');
            if (contentArea) {
                contentArea.style.display = this.tabs.length > 0 ? 'block' : 'none';
            }
        },

        // 显示欢迎页
        showWelcome: function() {
            var contentArea = document.getElementById('tabContent');
            if (contentArea) contentArea.innerHTML = '';
            var welcome = document.getElementById('welcomeContent');
            if (welcome) welcome.style.display = 'flex';
        }
    };
})();
```

- [ ] **Step 2: 修改 register 方法，增加 closable 参数**

将 `register: function(id, title, renderFn)` 改为：
```javascript
register: function(id, title, renderFn, closable) {
    if (this.tabs.some(function(t) { return t.id === id; })) return;
    this.tabs.push({ id: id, title: title, renderFn: renderFn, closable: closable !== false });
},
```

- [ ] **Step 3: 修改 render 方法，closable 为 false 时不显示关闭按钮**

```javascript
this.tabs.forEach(function(tab) {
    var active = tab.id === TabManager.activeId ? 'active' : '';
    var closeBtn = tab.closable ? '<span class="tab-close" data-id="' + tab.id + '">×</span>' : '';
    html += '<div class="tab-item ' + active + '" data-id="' + tab.id + '">' +
        '<span class="tab-title">' + tab.title + '</span>' +
        closeBtn +
        '</div>';
});
```

- [ ] **Step 4: 提交**

```bash
git add assets/script/tab-manager.js
git commit -m "feat(tab-manager): 支持不可关闭 Tab"
```

---

### Task 3: 创建首页模块 `assets/script/home.js`

**Files:**
- Create: `assets/script/home.js`

- [ ] **Step 1: 创建文件**

```javascript
/**
 * 首页模块
 * 左侧：用户信息、日历、公告
 * 右侧：代办事项 CRUD
 */
(function() {
    var container;
    var editingId = null;  // 当前编辑的待办 ID

    // localStorage key
    var STORAGE_KEY = 'todos';

    // 获取用户信息
    function getUserInfo() {
        var user = localStorage.getItem('user');
        if (!user) return { userName: '未登录', phone: '' };
        try {
            return JSON.parse(user);
        } catch (e) {
            return { userName: '未知', phone: '' };
        }
    }

    // 脱敏手机号
    function maskPhone(phone) {
        if (!phone || phone.length !== 11) return phone || '';
        return phone.substring(0, 3) + '****' + phone.substring(7);
    }

    // 获取用户名首字母
    function getInitial(name) {
        if (!name) return '?';
        return name.charAt(0).toUpperCase();
    }

    // 获取代办列表
    function getTodos() {
        var data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        try {
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    }

    // 保存代办列表
    function saveTodos(todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }

    // 生成唯一 ID
    function generateId() {
        return Date.now().toString();
    }

    // HTML 转义
    function escapeHtml(str) {
        if (str == null) return '';
        return String(str).replace(/[&<>"']/g, function(c) {
            return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c];
        });
    }

    // 渲染用户信息
    function renderUserInfo() {
        var user = getUserInfo();
        var initial = getInitial(user.userName);
        var maskedPhone = maskPhone(user.phone);
        document.getElementById('homeUserAvatar').textContent = initial;
        document.getElementById('homeUserName').textContent = escapeHtml(user.userName || '未知');
        document.getElementById('homeUserPhone').textContent = maskedPhone;
    }

    // 渲染日历
    function renderCalendar() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();
        var today = now.getDate();

        document.getElementById('calendarTitle').textContent = year + '年' + (month + 1) + '月';

        // 获取当月第一天是星期几
        var firstDay = new Date(year, month, 1).getDay();
        // 获取当月总天数
        var daysInMonth = new Date(year, month + 1, 0).getDate();
        // 获取上个月总天数
        var daysInLastMonth = new Date(year, month, 0).getDate();

        var weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        var html = weekdays.map(function(d) {
            return '<div class="calendar-weekday">' + d + '</div>';
        }).join('');

        // 上个月的天数
        for (var i = firstDay - 1; i >= 0; i--) {
            html += '<div class="calendar-day other-month">' + (daysInLastMonth - i) + '</div>';
        }

        // 当月的天数
        for (var d = 1; d <= daysInMonth; d++) {
            var isToday = d === today ? ' today' : '';
            html += '<div class="calendar-day' + isToday + '">' + d + '</div>';
        }

        // 下个月的天数（补满 6 行）
        var totalCells = firstDay + daysInMonth;
        var remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (var j = 1; j <= remaining; j++) {
            html += '<div class="calendar-day other-month">' + j + '</div>';
        }

        document.getElementById('calendarGrid').innerHTML = html;
    }

    // 渲染公告（静态数据）
    function renderNotice() {
        var notices = [
            '系统将于本周六进行版本更新',
            '新增待办事项功能上线',
            '用户管理模块优化完成',
            '密码安全策略升级公告'
        ];
        var listEl = document.getElementById('noticeList');
        listEl.innerHTML = notices.map(function(n) {
            return '<li class="notice-item">' + escapeHtml(n) + '</li>';
        }).join('');
    }

    // 渲染代办列表
    function renderTodos() {
        var todos = getTodos();
        var listEl = document.getElementById('todoList');

        if (todos.length === 0) {
            listEl.innerHTML = '<div class="todo-empty">暂无待办事项</div>';
            return;
        }

        listEl.innerHTML = todos.map(function(todo) {
            var checkedAttr = todo.completed ? 'checked' : '';
            var completedClass = todo.completed ? ' completed' : '';
            return '<div class="todo-item' + completedClass + '" data-id="' + todo.id + '">' +
                '<input type="checkbox" class="todo-checkbox" ' + checkedAttr + ' data-action="toggle">' +
                '<div class="todo-content">' +
                '<div class="todo-title">' + escapeHtml(todo.title) + '</div>' +
                '<div class="todo-text">' + escapeHtml(todo.content) + '</div>' +
                '</div>' +
                '<div class="todo-actions">' +
                '<button class="todo-edit-btn" data-action="edit">编辑</button>' +
                '<button class="todo-delete-btn" data-action="delete">删除</button>' +
                '</div>' +
                '</div>';
        }).join('');
    }

    // 绑定事件
    function bindEvents() {
        // 新增按钮
        document.getElementById('todoAddBtn').addEventListener('click', function() {
            editingId = null;
            document.getElementById('modalTitle').textContent = '新增待办';
            document.getElementById('todoTitleInput').value = '';
            document.getElementById('todoContentInput').value = '';
            document.getElementById('todoModal').classList.add('show');
        });

        // 待办列表操作委托
        document.getElementById('todoList').addEventListener('click', function(e) {
            var item = e.target.closest('.todo-item');
            if (!item) return;
            var id = item.dataset.id;
            var action = e.target.dataset.action;

            if (action === 'toggle') {
                var todos = getTodos();
                var todo = todos.find(function(t) { return t.id === id; });
                if (todo) {
                    todo.completed = e.target.checked;
                    saveTodos(todos);
                    renderTodos();
                }
            }

            if (action === 'edit') {
                var todos = getTodos();
                var todo = todos.find(function(t) { return t.id === id; });
                if (todo) {
                    editingId = id;
                    document.getElementById('modalTitle').textContent = '编辑待办';
                    document.getElementById('todoTitleInput').value = todo.title;
                    document.getElementById('todoContentInput').value = todo.content;
                    document.getElementById('todoModal').classList.add('show');
                }
            }

            if (action === 'delete') {
                var todos = getTodos();
                var newTodos = todos.filter(function(t) { return t.id !== id; });
                saveTodos(newTodos);
                renderTodos();
            }
        });

        // 弹窗取消
        document.getElementById('todoCancelBtn').addEventListener('click', function() {
            document.getElementById('todoModal').classList.remove('show');
            editingId = null;
        });

        // 弹窗确认
        document.getElementById('todoSubmitBtn').addEventListener('click', function() {
            var title = document.getElementById('todoTitleInput').value.trim();
            var content = document.getElementById('todoContentInput').value.trim();

            if (!title) {
                alert('请输入标题');
                return;
            }

            var todos = getTodos();

            if (editingId) {
                // 编辑
                var todo = todos.find(function(t) { return t.id === editingId; });
                if (todo) {
                    todo.title = title;
                    todo.content = content;
                }
            } else {
                // 新增
                todos.push({
                    id: generateId(),
                    title: title,
                    content: content,
                    completed: false
                });
            }

            saveTodos(todos);
            document.getElementById('todoModal').classList.remove('show');
            editingId = null;
            renderTodos();
        });

        // 点击遮罩关闭弹窗
        document.getElementById('todoModal').addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
                editingId = null;
            }
        });
    }

    // 渲染整个首页
    function render() {
        container.innerHTML =
            '<link rel="stylesheet" href="../assets/css/home.css">' +
            '<div class="home-container">' +
            '  <div class="home-left">' +
            '    <div class="user-info">' +
            '      <div class="user-avatar" id="homeUserAvatar">?</div>' +
            '      <div class="user-details">' +
            '        <div class="user-name" id="homeUserName">加载中...</div>' +
            '        <div class="user-phone" id="homeUserPhone"></div>' +
            '      </div>' +
            '    </div>' +
            '    <div class="calendar-block">' +
            '      <div class="section-title">日历</div>' +
            '      <div class="calendar-header">' +
            '        <span class="calendar-title" id="calendarTitle"></span>' +
            '      </div>' +
            '      <div class="calendar-grid" id="calendarGrid"></div>' +
            '    </div>' +
            '    <div class="notice-block">' +
            '      <div class="section-title">公告</div>' +
            '      <ul class="notice-list" id="noticeList"></ul>' +
            '    </div>' +
            '  </div>' +
            '  <div class="home-right">' +
            '    <div class="todo-block">' +
            '      <div class="todo-header">' +
            '        <div class="section-title" style="margin-bottom:0;border:none;padding-bottom:0">待办事项</div>' +
            '        <button class="todo-add-btn" id="todoAddBtn">+ 新增</button>' +
            '      </div>' +
            '      <div class="todo-list" id="todoList"></div>' +
            '    </div>' +
            '  </div>' +
            '</div>' +
            '<div class="modal-overlay" id="todoModal">' +
            '  <div class="modal-box">' +
            '    <div class="modal-title" id="modalTitle">新增待办</div>' +
            '    <div class="modal-form">' +
            '      <div class="form-group">' +
            '        <label class="form-label">标题</label>' +
            '        <input type="text" class="form-input" id="todoTitleInput" placeholder="请输入待办标题">' +
            '      </div>' +
            '      <div class="form-group">' +
            '        <label class="form-label">内容</label>' +
            '        <textarea class="form-input" id="todoContentInput" placeholder="请输入待办内容"></textarea>' +
            '      </div>' +
            '    </div>' +
            '    <div class="modal-buttons">' +
            '      <button class="btn-cancel" id="todoCancelBtn">取消</button>' +
            '      <button class="btn-primary" id="todoSubmitBtn">确定</button>' +
            '    </div>' +
            '  </div>' +
            '</div>';

        renderUserInfo();
        renderCalendar();
        renderNotice();
        renderTodos();
        bindEvents();
    }

    // 公开接口
    window.HomeModule = {
        init: function(cont) {
            container = cont;
            render();
        },
        refresh: function() {
            render();
        },
        destroy: function() {}
    };
})();
```

- [ ] **Step 2: 提交**

```bash
git add assets/script/home.js
git commit -m "feat(home): 创建首页模块"
```

---

### Task 4: 修改 main.html 注册首页 Tab

**Files:**
- Modify: `html/main.html:326-340`

- [ ] **Step 1: 在 TabManager 注册处添加首页注册代码**

找到 main.html 中加载 tab-manager.js 后的 script 块，在 `loadIconSprites().then()` 的回调中，在 `renderMenu()` 之前添加：

```javascript
// 注册首页 Tab（不可关闭，最左端）
TabManager.register('home', '首页', function() {
    HomeModule.init(document.getElementById('tabContent'));
}, false);

// 默认打开首页
TabManager.open('home');
```

注意：需要加载 home.js 模块。在 `loadModule` 函数的 `moduleMap` 中添加 home 映射：

```javascript
var moduleMap = {
    'home': { type: 'html', html: '' },  // 首页不需要加载 HTML 片段
    'user': { type: 'html', html: '../html/sys/user.html' }
};
```

实际上首页的 HTML 是通过 HomeModule.init 直接渲染到 `#tabContent` 的，所以不需要额外的 HTML 加载。只需要在 main.html 中引入 `assets/script/home.js` 即可。

在 `loadModule` 函数的 moduleMap 中添加 `'home': { type: 'html', html: '' }` 并不会加载任何东西，因为空字符串会导致 fetch 失败。

更好的方式是：在 main.html 的 script 中，TabManager 注册完成后，直接调用 `HomeModule.init()`。

具体修改：

1. 在 `<script src="../assets/script/tab-manager.js"></script>` 后添加：
   `<script src="../assets/script/home.js"></script>`

2. 在 `loadIconSprites().then()` 的回调中，在 `renderMenu()` 之前添加首页注册逻辑

将 `renderMenu()` 改为在首页注册之后执行。

完整修改内容如下：

**Step 1: 添加 home.js 引用**

在 tab-manager.js 引用之后添加：
```html
<script src="../assets/script/home.js"></script>
```

**Step 2: 修改 script 块中的代码**

将 `loadIconSprites().then(function() { renderMenu(); ...` 修改为：
```javascript
// 注册首页 Tab（不可关闭，最左端）
TabManager.register('home', '首页', function() {
    HomeModule.init(document.getElementById('tabContent'));
}, false);

// 默认打开首页
TabManager.open('home');

// 渲染顶部菜单
loadIconSprites().then(function() {
    renderMenu();
    // ... 其余代码保持不变
});
```

- [ ] **Step 2: 提交**

```bash
git add html/main.html
git commit -m "feat(home): 注册首页 Tab，默认打开"
```

---

## 自检清单

1. **Spec 覆盖检查：**
   - [x] 首页 Tab 不可关闭（TabManager.closable=false）
   - [x] 首页位于最左端（tabs 数组第一个元素）
   - [x] 左侧 30%：用户信息、日历、公告
   - [x] 右侧 70%：代办事项 CRUD
   - [x] localStorage 存储 todos

2. **占位符扫描：** 无 TBD/TODO/实现后续等占位符

3. **类型一致性检查：**
   - TabManager.register 参数：`id, title, renderFn, closable`
   - HomeModule.init 参数：`container`
   - Todo 数据结构：`{id, title, content, completed}`