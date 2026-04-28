# 用户管理页面实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `main.html` 基础上实现 Tab 式多页面架构，并完成用户管理页面（CRUD + 角色分配）

**Architecture:** TabManager 作为 SPA 核心，管理 Tab 的打开/关闭/切换；各业务模块（用户管理）作为独立 IIFE 模块，暴露 init/refresh/destroy 接口，渲染到 Tab 内容区。

**Tech Stack:** 原生 HTML/CSS/JavaScript（无框架），Ant Design 风格 UI

---

## 文件清单

| 文件 | 操作 | 职责 |
|------|------|------|
| `html/main.html` | 修改 | Tab 栏容器、TabManager、菜单点击改为 Tab 打开 |
| `assets/script/tab-manager.js` | 创建 | TabManager 核心模块 |
| `assets/css/user.css` | 创建 | 用户管理页面样式（复用 address.css 风格） |
| `assets/script/user.js` | 创建 | 用户管理 IIFE 模块，暴露 init/refresh/destroy |
| `html/client/user.html` | 创建 | 用户管理页面 HTML 结构（供 JS 渲染内容） |

---

## 任务分解

---

### Task 1: TabManager 核心实现

**Files:**
- 创建: `assets/script/tab-manager.js`

- [ ] **Step 1: 创建 tab-manager.js，定义 TabManager 全局对象**

```javascript
/**
 * TabManager - SPA Tab 切换管理器
 * 管理 Tab 的打开、关闭、激活，以及 Tab 栏和内容的渲染
 */
var TabManager = {
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
```

- [ ] **Step 2: 在 main.html 中引入 tab-manager.js 并修改菜单点击行为**

在 `<script>` 标签最后添加 TabManager 初始化，将菜单项点击从 `window.location.href` 改为 `TabManager.open()`：

修改 `html/main.html` 第 327-331 行的菜单点击事件：
```javascript
// 原代码：
if (child.menuUrl) {
    window.location.href = child.menuUrl;
}

// 改为（需先给每个菜单项添加 data-module-id）：
if (child.menuUrl) {
    var moduleId = child.menuUrl.replace(/^\//, '').replace(/\//g, '-');
    TabManager.open(moduleId);
}
```

同时在 `renderMenu` 函数最后添加 Tab 注册：
```javascript
// 注册所有菜单为可打开的 Tab
leafMenus.forEach(function(child) {
    var moduleId = child.menuUrl ? child.menuUrl.replace(/^\//, '').replace(/\//g, '-') : '';
    if (moduleId && child.menuType === 'MENU') {
        TabManager.register(moduleId, child.menuName, function() {
            // 这里动态加载对应模块
            loadModule(moduleId);
        });
    }
});
```

新增 `loadModule` 函数，根据 moduleId 动态加载对应 JS 并调用其 init：
```javascript
function loadModule(moduleId) {
    var moduleMap = {
        'system-user': { js: '../assets/script/user.js', css: '../assets/css/user.css' }
    };
    var mod = moduleMap[moduleId];
    if (!mod) return;
    // 加载 CSS
    if (!document.querySelector('link[href="' + mod.css + '"]')) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = mod.css;
        document.head.appendChild(link);
    }
    // 加载 JS（已加载则直接调用）
    var contentEl = document.getElementById('tabContent');
    if (moduleId === 'system-user') {
        UserModule.init(contentEl);
    }
}
```

---

### Task 2: 用户管理页面 HTML 结构

**Files:**
- 创建: `html/client/user.html`

- [ ] **Step 1: 创建 html/client/user.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>用户管理</title>
</head>
<body>
    <div class="container" id="userManagementApp">
        <h1>用户管理</h1>
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
                    <th>序号</th>
                    <th>手机号</th>
                    <th>用户名</th>
                    <th>邮箱</th>
                    <th>省市</th>
                    <th>状态</th>
                    <th>创建时间</th>
                    <th>操作</th>
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
</body>
</html>
```

---

### Task 3: 用户管理样式

**Files:**
- 创建: `assets/css/user.css`

- [ ] **Step 1: 创建 assets/css/user.css（从 address.css 复制并调整）**

样式与 `address.css` 保持一致，仅需确保 `.container h1` 标题为"用户管理"，新增样式包括：

```css
/* 用户管理页面特有样式 */
#userManagementApp .search-bar {
    margin-bottom: 20px;
}

#userManagementApp .search-bar-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
}

#userManagementApp .search-bar-row label {
    font-weight: 500;
    color: #333;
}

#userManagementApp .search-bar input,
#userManagementApp .search-bar select {
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
}

#userManagementApp .search-bar input {
    width: 160px;
}

#userManagementApp #queryBtn {
    background-color: #1890ff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
}

#userManagementApp #addBtn {
    background-color: #52c41a;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

/* 角色列表复选框 */
#roleList {
    margin: 15px 0;
    max-height: 300px;
    overflow-y: auto;
}

.role-item {
    display: flex;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
}

.role-item:last-child {
    border-bottom: none;
}

.role-item label {
    margin-left: 8px;
    cursor: pointer;
}
```

---

### Task 4: 用户管理逻辑

**Files:**
- 创建: `assets/script/user.js`

- [ ] **Step 1: 创建 assets/script/user.js，基础骨架**

```javascript
/**
 * 用户管理模块
 * 暴露 init(container), refresh(), destroy()
 */
(function() {
    var container;         // 模块容器
    var currentPage = 1;
    var currentPageSize = 10;
    var currentUserId;     // 当前编辑/分配角色的用户ID

    // Toast 提示
    function showToast(message, type) {
        var toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.className = 'toast ' + (type || 'info');
        toast.style.display = 'block';
        setTimeout(function() {
            toast.style.display = 'none';
        }, 2000);
    }

    // HTTP 请求封装
    function request(url, method, body) {
        var token = localStorage.getItem('token');
        var options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };
        if (body) options.body = JSON.stringify(body);
        return fetch(url, options).then(function(resp) { return resp.json(); });
    }

    // 格式化时间
    function formatTime(timeStr) {
        if (!timeStr) return '-';
        var d = new Date(timeStr);
        var pad = function(n) { return n < 10 ? '0' + n : n; };
        return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + ' ' +
            pad(d.getHours()) + ':' + pad(d.getMinutes());
    }

    // 获取请求参数
    function getQueryParams() {
        return {
            phone: document.getElementById('searchPhone').value.trim(),
            status: document.getElementById('searchStatus').value,
            pageNum: currentPage,
            pageSize: currentPageSize
        };
    }

    // 渲染表格
    function renderTable(data) {
        var tbody = document.getElementById('userTableBody');
        if (!tbody) return;
        if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#999">暂无数据</td></tr>';
            return;
        }
        var start = (currentPage - 1) * currentPageSize + 1;
        var html = '';
        data.forEach(function(user, i) {
            var provinceCity = [user.province, user.city].filter(Boolean).join('/') || '-';
            var statusHtml = user.status === 'Y'
                ? '<span class="flag-yes">正常</span>'
                : '<span class="flag-no">禁用</span>';
            html += '<tr>' +
                '<td>' + (start + i) + '</td>' +
                '<td>' + user.phone + '</td>' +
                '<td>' + (user.userName || '-') + '</td>' +
                '<td>' + (user.email || '-') + '</td>' +
                '<td>' + provinceCity + '</td>' +
                '<td>' + statusHtml + '</td>' +
                '<td>' + formatTime(user.createTime) + '</td>' +
                '<td>' +
                    '<button class="editBtn" data-userid="' + user.userId + '">编辑</button>' +
                    '<button class="deleteBtn" data-userid="' + user.userId + '">删除</button>' +
                    '<button class="roleBtn" data-userid="' + user.userId + '" data-phone="' + user.phone + '">分配角色</button>' +
                '</td>' +
                '</tr>';
        });
        tbody.innerHTML = html;
    }

    // 渲染分页信息
    function renderPagination(total) {
        var totalPages = Math.ceil(total / currentPageSize);
        var pageInfo = document.getElementById('pageInfo');
        if (pageInfo) {
            pageInfo.textContent = '共 ' + total + ' 条，第 ' + currentPage + '/' + totalPages + ' 页';
        }
        document.getElementById('prevBtn').disabled = currentPage <= 1;
        document.getElementById('nextBtn').disabled = currentPage >= totalPages;
    }

    // 查询列表
    function queryUsers() {
        var params = getQueryParams();
        currentPage = 1;
        request('/api/users/query', 'POST', params).then(function(res) {
            if (res.code === '000000') {
                var data = res.data || [];
                renderTable(data);
                renderPagination(data.length > 0 ? data.length * currentPage : 0);
                // 注意：实际项目需后端返回 total，这里简化为估算
            } else {
                showToast(res.message || '查询失败', 'error');
            }
        });
    }

    // 绑定事件
    function bindEvents() {
        // 查询
        document.getElementById('queryBtn').addEventListener('click', queryUsers);

        // 新增
        document.getElementById('addBtn').addEventListener('click', function() {
            currentUserId = null;
            document.getElementById('modalTitle').textContent = '新增用户';
            document.getElementById('userForm').reset();
            document.getElementById('formUserId').value = '';
            document.getElementById('formPhone').readOnly = false;
            document.getElementById('formPassword').parentElement.querySelector('label').textContent = '密码';
            document.getElementById('formPassword').parentElement nextElementSibling.style.display = '';
            document.getElementById('userModal').style.display = 'flex';
        });

        // 编辑/删除/分配角色 委托
        document.getElementById('userTableBody').addEventListener('click', function(e) {
            var target = e.target;
            var userId = target.dataset.userid;

            if (target.classList.contains('editBtn')) {
                // 填充编辑表单（获取用户详情接口暂未文档化，这里简化处理）
                currentUserId = parseInt(userId);
                document.getElementById('modalTitle').textContent = '编辑用户';
                document.getElementById('formUserId').value = userId;
                // 调用获取用户详情获取完整数据
                // 简化：直接使用列表中的数据填充
                var row = target.closest('tr');
                var cells = row.cells;
                document.getElementById('formPhone').value = cells[1].textContent;
                document.getElementById('formPhone').readOnly = true;
                document.getElementById('formPassword').value = '';
                document.getElementById('formPassword').parentElement.querySelector('label').textContent = '密码（不填则不修改）';
                document.getElementById('userModal').style.display = 'flex';
            }

            if (target.classList.contains('deleteBtn')) {
                if (!confirm('确定删除该用户？')) return;
                request('/api/users/delete?userId=' + userId, 'POST').then(function(res) {
                    if (res.code === '000000') {
                        showToast('删除成功', 'success');
                        queryUsers();
                    } else {
                        showToast(res.message || '删除失败', 'error');
                    }
                });
            }

            if (target.classList.contains('roleBtn')) {
                currentUserId = parseInt(userId);
                var phone = target.dataset.phone;
                document.getElementById('roleModalTitle').textContent = '为 ' + phone + ' 分配角色';
                // 加载角色列表
                var roles = JSON.parse(localStorage.getItem('roles') || '[]');
                var roleListEl = document.getElementById('roleList');
                roleListEl.innerHTML = roles.map(function(r) {
                    return '<div class="role-item"><input type="checkbox" value="' + r.roleId + '" id="role_' + r.roleId + '"><label for="role_' + r.roleId + '">' + r.roleName + '</label></div>';
                }).join('');
                document.getElementById('roleModal').style.display = 'flex';
            }
        });

        // 表单提交（新增/编辑）
        document.getElementById('userForm').addEventListener('submit', function(e) {
            e.preventDefault();
            var userId = document.getElementById('formUserId').value;
            var phone = document.getElementById('formPhone').value.trim();
            var password = document.getElementById('formPassword').value;
            var status = document.getElementById('formStatus').value;

            if (!phone || !/^1\d{10}$/.test(phone)) {
                showToast('请输入正确的手机号', 'error');
                return;
            }

            var payload = { phone: phone, status: status };
            if (userId) {
                payload.userId = parseInt(userId);
                if (password) payload.password = password;
                request('/api/users/update', 'POST', payload).then(function(res) {
                    if (res.code === '000000') {
                        showToast('更新成功', 'success');
                        document.getElementById('userModal').style.display = 'none';
                        queryUsers();
                    } else {
                        showToast(res.message || '更新失败', 'error');
                    }
                });
            } else {
                if (!password || password.length < 6) {
                    showToast('密码最少6位', 'error');
                    return;
                }
                payload.password = password;
                request('/api/users/create', 'POST', payload).then(function(res) {
                    if (res.code === '000000') {
                        showToast('新增成功', 'success');
                        document.getElementById('userModal').style.display = 'none';
                        queryUsers();
                    } else {
                        showToast(res.message || '新增失败', 'error');
                    }
                });
            }
        });

        // 取消弹窗
        document.getElementById('cancelBtn').addEventListener('click', function() {
            document.getElementById('userModal').style.display = 'none';
        });

        // 分配角色确认
        document.getElementById('roleConfirmBtn').addEventListener('click', function() {
            var checked = document.querySelectorAll('#roleList input:checked');
            var roleIds = Array.from(checked).map(function(cb) { return parseInt(cb.value); });
            request('/api/users/' + currentUserId + '/roles/assign', 'POST', roleIds).then(function(res) {
                if (res.code === '000000') {
                    showToast('分配成功', 'success');
                    document.getElementById('roleModal').style.display = 'none';
                } else {
                    showToast(res.message || '分配失败', 'error');
                }
            });
        });

        document.getElementById('roleCancelBtn').addEventListener('click', function() {
            document.getElementById('roleModal').style.display = 'none';
        });

        // 分页
        document.getElementById('pageSizeSelect').addEventListener('change', function() {
            currentPageSize = parseInt(this.value);
            queryUsers();
        });

        document.getElementById('prevBtn').addEventListener('click', function() {
            if (currentPage > 1) { currentPage--; queryUsers(); }
        });

        document.getElementById('nextBtn').addEventListener('click', function() {
            currentPage++;
            queryUsers();
        });

        // 弹窗背景点击关闭
        ['userModal', 'roleModal'].forEach(function(id) {
            document.getElementById(id).addEventListener('click', function(e) {
                if (e.target === this) this.style.display = 'none';
            });
        });
    }

    // 公开接口
    window.UserModule = {
        init: function(cont) {
            container = cont;
            // 加载用户管理页面 HTML
            container.innerHTML = document.getElementById('userManagementApp').outerHTML;
            // 重新绑定事件（因为 DOM 已迁移）
            bindEvents();
            // 初始查询
            queryUsers();
        },
        refresh: function() {
            queryUsers();
        },
        destroy: function() {
            // 清理定时器/事件等
        }
    };
})();
```

**注意：** 上述 UserModule.init 中直接使用 innerHTML 迁移 DOM 会导致事件绑定丢失。实际实现时应将 HTML 模板字符串缓存在 JS 中，避免依赖 document.getElementById 获取已迁移的 DOM。

---

### Task 5: Tab 栏样式

**Files:**
- 修改: `html/main.html`（style 部分）

- [ ] **Step 1: 在 main.html 的 `<style>` 中新增 Tab 栏样式**

在 `.main-content` 样式后添加：

```css
/* --- Tab 栏 --- */
.tab-bar {
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    padding: 0 16px;
    min-height: 40px;
}

.tab-item {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    border: 1px solid #e8e8e8;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    margin-right: 4px;
    cursor: pointer;
    font-size: 14px;
    color: #666;
    background: #fafafa;
    transition: all 0.2s;
}

.tab-item:hover {
    color: #1890ff;
    background: #fff;
}

.tab-item.active {
    color: #1890ff;
    background: #fff;
    border-color: #1890ff;
    position: relative;
}

.tab-item.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: #fff;
}

.tab-close {
    margin-left: 8px;
    width: 16px;
    height: 16px;
    line-height: 14px;
    text-align: center;
    border-radius: 50%;
    font-size: 14px;
    color: #999;
    transition: all 0.2s;
}

.tab-close:hover {
    background: #ff4d4f;
    color: #fff;
}

/* Tab 内容区 */
.tab-content {
    display: none;
    padding: 20px;
    background: #fff;
    min-height: 500px;
}

.tab-content.active {
    display: block;
}

#welcomeContent {
    display: flex;
}
```

- [ ] **Step 2: 在 main.html HTML 结构中添加 Tab 栏容器**

在 `<main class="main-content">` 内部，`<div class="content-card">` 之前插入：

```html
<div id="tabBar" class="tab-bar"></div>
<div id="tabContent" class="tab-content">
    <div id="welcomeContent" class="content-card">
        <h2>登录成功</h2>
        <p>欢迎使用管理系统</p>
    </div>
</div>
```

并修改原来的 `<div class="content-card">` 外层包裹，以便控制显示隐藏。

- [ ] **Step 3: 修改 main.html 中菜单点击逻辑**

将菜单项点击从 `window.location.href` 改为 `TabManager.open(moduleId)`。

---

### Task 6: 联调与验证

- [ ] **Step 1: 在浏览器中打开 main.html，使用登录菜单进入系统**

验证流程：
1. 点击"用户管理"菜单 → Tab 栏出现"用户管理"Tab，内容区加载用户列表
2. 再次点击"用户管理"菜单 → Tab 不重复，激活已有 Tab
3. 点击"用户管理"Tab 上的 × → Tab 关闭，显示欢迎页
4. 查询/新增/编辑/删除/分配角色功能正常
5. Toast 提示正常显示

---

## 自检清单

- [ ] TabManager 在 main.html 中正确引入
- [ ] 菜单点击打开/切换 Tab 而非整页跳转
- [ ] 关闭所有 Tab 后显示欢迎页
- [ ] UserModule 暴露 init/refresh/destroy 接口
- [ ] 用户管理页面包含搜索栏、表格、分页
- [ ] 新增/编辑弹窗字段完整
- [ ] 分配角色弹窗正常加载角色列表并提交
- [ ] Toast 提示正常显示
- [ ] 样式与 Ant Design 风格一致