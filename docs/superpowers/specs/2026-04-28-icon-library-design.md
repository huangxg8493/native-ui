# 图标库设计方案

## 概述

为项目建立本地 SVG 图标库，从 Ant Design Icons 和 Element Plus Icons 中提取所有图标，生成 SVG Sprite 文件，方便离线使用且无 CDN 依赖。

## 数据来源

| 库 | 仓库 | 图标数量 | 地址 |
|---|---|---|---|
| Ant Design Icons | ant-design/ant-design-icons | ~780 | https://github.com/ant-design/ant-design-icons |
| Element Plus Icons | element-plus/element-plus-icons | ~200 | https://github.com/element-plus/element-plus-icons |

## 文件结构

```
assets/icons/
  ant-design-icons.svg   # Ant Design 图标集
  element-plus-icons.svg # Element Plus 图标集
  icons.css              # 使用辅助类（保留现有 emoji 方案作为 fallback）
  index.html             # 图标预览页面
```

## SVG Sprite 格式

每个 SVG 文件包含 `<symbol>` 标签：

```svg
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="icon-user" viewBox="0 0 1024 1024">
    <path d="..."/>
  </symbol>
  <symbol id="icon-setting" viewBox="0 0 1024 1024">
    <path d="..."/>
  </symbol>
</svg>
```

## 使用方式

### 1. HTML 直接引用
```html
<svg width="16" height="16"><use href="#icon-user"></use></svg>
```

### 2. CSS 类方式
```html
<link rel="stylesheet" href="assets/icons/icons.css">
<span class="anticon anticon-user"></span>
```

## 实现步骤

1. 克隆 ant-design-icons 仓库，提取 SVG 文件并转换为 `<symbol>` 格式
2. 克隆 element-plus-icons 仓库，提取 SVG 文件并转换为 `<symbol>` 格式
3. 生成配套 CSS 文件
4. 创建图标预览页面 index.html
5. 清理旧版 assets/css/icons.css（可选，保留作 fallback）

## 技术细节

- viewBox 统一为 `0 0 1024 1024`（两库一致）
- 图标 ID 格式：`ant-{name}`（Ant Design）、`el-{name}`（Element Plus）
- stroke-width 保持原值
- 颜色通过 `currentColor` 或 CSS fill 控制