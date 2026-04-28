# 主页菜单系统设计

**日期：** 2026-04-28

**需求：** 根据 localStorage 中存储的菜单数据，在 main.html 实现顶部水平菜单系统

---

## 1. 菜单数据结构

登录成功后，菜单数据存储在 `localStorage.getItem('menus')`，结构为树形：

```js
{
    "menuId": 1,
    "menuName": "系统管理",        // 一级菜单名
    "menuUrl": "/system",
    "icon": "setting",            // 图标
    "sortOrder": 1,
    "isLeaf": "N",                // N=目录，有子菜单
    "menuType": "CATALOG",        // CATALOG=目录，MENU=菜单
    "children": [
        {
            "menuId": 2,
            "menuName": "用户管理",  // 子菜单
            "menuUrl": "/system/user",
            "icon": "user",
            "sortOrder": 1,
            "isLeaf": "Y",         // Y=叶子节点，是最终菜单
            "menuType": "MENU",
            "children": []
        }
    ]
}
```

---

## 2. 布局结构

```
┌─────────────────────────────────────────────────────────┐
│  LOGO    [系统管理 ▼]  [用户管理]  [权限管理]    退出登录 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    内容区域                              │
│                                                         │
```

- **顶部导航栏**：高度 64px，白色背景，底部投影
- **LOGO 区域**：左侧，显示系统名称
- **一级菜单**：水平排列在顶部，仅显示 `menuType=CATALOG` 的目录
- **退出按钮**：右侧

---

## 3. 交互行为

### Hover 展开
- 鼠标悬停在一级菜单上，延迟 **150ms** 展开下拉菜单
- 下拉菜单显示该目录下的所有子菜单（`isLeaf=Y` 的 MENU 类型）
- 鼠标离开后，延迟 **200ms** 收起下拉
- 下拉菜单紧贴一级菜单下方显示

### 点击跳转
- 点击子菜单，跳转到 `menuUrl` 对应页面
- 如果 `menuUrl` 以 `/` 开头，在当前窗口跳转

### 样式细节
- 一级菜单项：横向排列，padding 16px
- Hover 时：一级菜单项背景变浅蓝色（#e6f7ff）
- 下拉菜单：白色背景，阴影，圆角 4px
- 子菜单项：padding 12px 16px，hover 时背景变浅蓝

---

## 4. 图标方案

菜单数据包含 `icon` 字段（如 `setting`、`user`）。使用 Ant Design 图标字体：

```html
<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/antd/4.24.0/icons.css">
```

图标映射：
- `setting` → 设置
- `user` → 用户
- 其他 → 使用通用图标

---

## 5. 实现文件

**修改：** `html/main.html`

- 添加 Ant Design 图标 CDN
- 添加顶部菜单栏 HTML 结构
- 添加菜单渲染 JS 逻辑
- 添加 hover 展开/收起交互
- 添加点击跳转逻辑

---

## 6. 菜单渲染逻辑

```js
// 从 localStorage 获取菜单
var menus = JSON.parse(localStorage.getItem('menus') || '[]');

// 过滤出一级目录（CATALOG 类型）
var topMenus = menus.filter(function(m) {
    return m.menuType === 'CATALOG';
});

// 渲染一级菜单
// 每个一级菜单包含：menuName + icon
// hover 时显示下拉框（children 中的 MENU 类型）
```

---

## 7. 边缘情况

| 情况 | 处理方式 |
|------|---------|
| menus 为空或 null | 显示"暂无菜单"提示，隐藏菜单栏 |
| 某目录无子菜单 | hover 时下拉框显示"暂无子菜单" |
| menuUrl 为空 | 子菜单点击后无跳转，仅高亮 |
| 只有一个顶级目录 | 仍然水平显示 |