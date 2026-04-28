# 菜单图标库集成实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 将 main.html 中的菜单图标改为使用 assets/icons 图标库

**架构：** 在 main.html 中动态加载 SVG Sprite，并修改 getIconSvg 函数直接使用图标库 ID

**技术栈：** 原生 HTML/CSS/JavaScript，SVG Sprite

---

## 文件结构

```
html/main.html   # 仅修改此文件，原有代码注释保留
```

---

## 任务列表

### Task 1: 修改 main.html 集成图标库

**Files:**
- Modify: `html/main.html`

- [ ] **Step 1: 添加 SVG Sprite 加载函数**

找到 `renderMenu` 函数，在其上方添加：

```javascript
// 加载图标库 SVG Sprite
async function loadIconSprites() {
    const files = [
        'assets/icons/ant-design-icons.svg',
        'assets/icons/element-plus-icons.svg'
    ];
    for (const url of files) {
        try {
            const resp = await fetch(url);
            const text = await resp.text();
            const div = document.createElement('div');
            div.style.display = 'none';
            div.innerHTML = text;
            document.body.appendChild(div);
        } catch (e) {
            console.warn('加载图标失败:', url, e);
        }
    }
}
```

- [ ] **Step 2: 注释原 iconMap 对象**

将原 `iconMap` 对象注释：

```javascript
/* --- 原图标映射（已弃用，使用图标库）---
var iconMap = {
    'setting': '...',
    'user': '...',
    ...
};
--- 原图标映射结束 --- */
```

- [ ] **Step 3: 添加新的 getIconSvg 函数**

在原 `getIconSvg` 函数上方添加：

```javascript
// 使用图标库的 getIconSvg 函数
function getIconSvg(icon) {
    if (!icon) {
        return '<svg viewBox="0 0 1024 1024"><use href="#ant-setting"></use></svg>';
    }
    return '<svg viewBox="0 0 1024 1024"><use href="#' + icon + '"></use></svg>';
}
```

- [ ] **Step 4: 注释原 getIconSvg 函数**

```javascript
/* --- 原 getIconSvg 函数（已弃用）---
function getIconSvg(icon) {
    return iconMap[icon] || iconMap['default'];
}
--- 原函数结束 --- */
```

- [ ] **Step 5: 在页面加载时调用 loadIconSprites**

在 IIFE 中，renderMenu() 调用前添加：

```javascript
// 先加载图标库，再渲染菜单
loadIconSprites().then(function() {
    renderMenu();
});
```

- [ ] **Step 6: 提交更改**

```bash
git add html/main.html && git commit -m "feat: 集成图标库到菜单系统"
```

---

## 自检清单

- [x] 添加了 loadIconSprites 函数加载 SVG Sprite
- [x] 原有 iconMap 对象注释保留
- [x] 新 getIconSvg 使用图标库 ID
- [x] 原 getIconSvg 函数注释保留
- [x] 页面加载时先加载图标库再渲染菜单