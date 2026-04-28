# 主页菜单系统实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 main.html 实现顶部水平菜单系统，从 localStorage 获取菜单数据渲染，支持 hover 展开子菜单

**Architecture:** 修改 main.html，添加顶部导航栏、菜单 CSS 样式、菜单渲染 JS 逻辑、hover 交互

**Tech Stack:** 原生 HTML/CSS/JavaScript，Ant Design 图标

---

## 文件结构

- 修改: `html/main.html` — 添加顶部菜单栏 HTML、CSS 样式、JS 逻辑

---

## Task 1: 添加 Ant Design 图标 CDN 和基础布局

**Files:**
- Modify: `html/main.html`

- [ ] **Step 1: 在 head 中添加 Ant Design 图标 CDN**

在 `</title>` 后添加：
```html
<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/antd/4.24.0/icons.css">
```

- [ ] **Step 2: 添加顶部菜单栏 HTML 结构**

将原 header div 替换为：
```html
<div class="header">
    <div class="header-logo">管理系统</div>
    <div class="top-nav" id="topNav">
        <!-- 菜单将动态渲染到这里 -->
    </div>
    <div class="header-actions">
        <button class="logout-btn" id="logoutBtn">退出登录</button>
    </div>
</div>
```

- [ ] **Step 3: 提交代码**

```bash
git add html/main.html && git commit -m "feat: 添加顶部菜单栏基础结构和图标CDN"
```

---

## Task 2: 添加顶部菜单 CSS 样式

**Files:**
- Modify: `html/main.html`

- [ ] **Step 1: 在 style 标签中添加菜单相关 CSS**

在 `.logout-btn` 样式后添加：
```css
.header-logo {
    font-size: 18px;
    font-weight: 500;
    color: #1890ff;
}
.top-nav {
    display: flex;
    align-items: center;
    flex: 1;
    margin-left: 24px;
}
.menu-item {
    position: relative;
    padding: 0 16px;
    height: 64px;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #333;
    font-size: 14px;
    transition: background 0.3s;
}
.menu-item:hover {
    background: #e6f7ff;
}
.menu-item .anticon {
    margin-right: 6px;
    font-size: 14px;
}
.menu-item .menu-arrow {
    margin-left: 4px;
    font-size: 10px;
    color: #999;
}
.dropdown-menu {
    position: absolute;
    top: 64px;
    left: 0;
    min-width: 160px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    display: none;
    z-index: 1000;
}
.dropdown-menu.show {
    display: block;
}
.dropdown-item {
    padding: 12px 16px;
    cursor: pointer;
    color: #333;
    font-size: 14px;
    display: flex;
    align-items: center;
    transition: background 0.3s;
}
.dropdown-item:first-child {
    border-radius: 4px 4px 0 0;
}
.dropdown-item:last-child {
    border-radius: 0 0 4px 4px;
}
.dropdown-item:hover {
    background: #e6f7ff;
}
.dropdown-item .anticon {
    margin-right: 8px;
    font-size: 14px;
}
.no-menu {
    padding: 12px 16px;
    color: #999;
    font-size: 14px;
    text-align: center;
}
```

- [ ] **Step 2: 提交代码**

```bash
git add html/main.html && git commit -m "style: 添加顶部菜单栏 CSS 样式"
```

---

## Task 3: 实现菜单渲染和交互 JS 逻辑

**Files:**
- Modify: `html/main.html`

- [ ] **Step 1: 将原 script 内容替换为完整实现**

将原 script 内容：
```js
(function() {
    // 检查是否已登录
    var token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login/login.html';
        return;
    }

    // 退出登录
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('phone');
        localStorage.removeItem('user');
        localStorage.removeItem('roles');
        localStorage.removeItem('menus');
        window.location.href = 'login/login.html';
    });
})();
```

替换为：
```js
(function() {
    // 检查是否已登录
    var token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login/login.html';
        return;
    }

    // 退出登录
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('phone');
        localStorage.removeItem('user');
        localStorage.removeItem('roles');
        localStorage.removeItem('menus');
        window.location.href = 'login/login.html';
    });

    // 渲染顶部菜单
    function renderMenu() {
        var menus = JSON.parse(localStorage.getItem('menus') || '[]');
        var topNav = document.getElementById('topNav');

        if (!menus || menus.length === 0) {
            topNav.innerHTML = '<span class="no-menu">暂无菜单</span>';
            return;
        }

        // 过滤出一级目录（CATALOG 类型）
        var topMenus = menus.filter(function(m) {
            return m.menuType === 'CATALOG';
        });

        if (topMenus.length === 0) {
            topNav.innerHTML = '<span class="no-menu">暂无菜单</span>';
            return;
        }

        // 图标映射
        var iconMap = {
            'setting': 'anticon-setting',
            'user': 'anticon-user',
            'team': 'anticon-team',
            ' Safety': 'anticon-safety',
            'database': 'anticon-database',
            'file': 'anticon-file',
            'default': 'anticon-app'
        };

        function getIconClass(icon) {
            return iconMap[icon] || iconMap['default'];
        }

        // 渲染一级菜单
        topMenus.forEach(function(menu) {
            var menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.innerHTML =
                '<span class="anticon ' + getIconClass(menu.icon) + '"></span>' +
                '<span>' + menu.menuName + '</span>' +
                '<span class="menu-arrow">▼</span>';

            // 创建下拉菜单
            var dropdown = document.createElement('div');
            dropdown.className = 'dropdown-menu';

            var children = menu.children || [];
            var leafMenus = children.filter(function(c) {
                return c.menuType === 'MENU' && c.isLeaf === 'Y';
            });

            if (leafMenus.length === 0) {
                dropdown.innerHTML = '<div class="no-menu">暂无子菜单</div>';
            } else {
                leafMenus.forEach(function(child) {
                    var item = document.createElement('div');
                    item.className = 'dropdown-item';
                    item.innerHTML =
                        '<span class="anticon ' + getIconClass(child.icon) + '"></span>' +
                        '<span>' + child.menuName + '</span>';
                    item.addEventListener('click', function() {
                        if (child.menuUrl) {
                            window.location.href = child.menuUrl;
                        }
                    });
                    dropdown.appendChild(item);
                });
            }

            menuItem.appendChild(dropdown);
            topNav.appendChild(menuItem);

            // hover 事件
            var hoverTimer = null;
            var leaveTimer = null;

            menuItem.addEventListener('mouseenter', function() {
                clearTimeout(leaveTimer);
                hoverTimer = setTimeout(function() {
                    dropdown.classList.add('show');
                }, 150);
            });

            menuItem.addEventListener('mouseleave', function() {
                clearTimeout(hoverTimer);
                leaveTimer = setTimeout(function() {
                    dropdown.classList.remove('show');
                }, 200);
            });
        });
    }

    renderMenu();
})();
```

- [ ] **Step 2: 提交代码**

```bash
git add html/main.html && git commit -m "feat: 实现顶部菜单渲染和hover交互逻辑"
```

---

## 验证步骤

1. 打开 login.html，使用正确账号登录
2. 确认 main.html 顶部显示一级菜单（如"系统管理"）
3. 鼠标 hover 到一级菜单上，确认 150ms 后展开下拉
4. 确认下拉显示子菜单项（如"用户管理"）
5. 点击子菜单，确认跳转到对应页面
6. 鼠标离开菜单，确认 200ms 后下拉收起