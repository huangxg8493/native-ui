# 菜单图标库集成设计方案

## 概述

将 main.html 中的菜单图标改为使用 assets/icons 图标库中的图标，通过数据库中菜单项的 icon 字段指定图标 ID。

## 现状

当前 main.html 中使用内联 SVG 定义的 `iconMap` 提供图标：
- 图标硬编码在代码中
- 新增图标需要修改代码

## 目标

使用 assets/icons 中的 SVG Sprite 图标库：
- Ant Design Icons: ID 格式 `ant-{name}`
- Element Plus Icons: ID 格式 `el-{name}`

## 实现方案

### 1. 加载 SVG Sprite

在 `renderMenu()` 函数执行前，动态加载两个 SVG Sprite 文件：
```javascript
async function loadIconSprites() {
  const files = [
    'assets/icons/ant-design-icons.svg',
    'assets/icons/element-plus-icons.svg'
  ];
  for (const url of files) {
    const resp = await fetch(url);
    const text = await resp.text();
    const div = document.createElement('div');
    div.style.display = 'none';
    div.innerHTML = text;
    document.body.appendChild(div);
  }
}
```

### 2. 修改 getIconSvg 函数

```javascript
function getIconSvg(icon) {
  return '<svg viewBox="0 0 1024 1024"><use href="#' + icon + '"></use></svg>';
}
```

### 3. 原有代码处理

- 原 `iconMap` 对象注释保留
- 原 `getIconSvg` 函数逻辑注释保留（新增函数覆盖）

## 数据库配置要求

菜单 icon 字段需配置图标库中的 ID：
- Ant Design 图标：如 `ant-user`、`ant-setting`
- Element Plus 图标：如 `el-user`、`el-setting`

## 约束

- 只修改 main.html
- 原有代码注释保留，不删除
- 不修改其他文件