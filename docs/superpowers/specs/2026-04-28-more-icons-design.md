# 扩展图标库设计方案

## 概述

在现有 Ant Design Icons 和 Element Plus Icons 基础上，新增以下图标库。

## 新增图标库

| 库 | 图标数量 | ID前缀 | 仓库 |
|---|---|---|---|
| Lucide | 1500+ | `lucide-` | lucide-icons/lucide |
| Heroicons | 450+ | `hero-` | tailwindlabs/heroicons |
| Phosphor Icons | 1400+ | `ph-` | phosphor-icons/phosphor-icons |
| Tabler Icons | 4500+ | `tabler-` | tabler/tabler-icons |
| Font Awesome | 2000+ | `fa-` | FortAwesome/Font-Awesome |
| Material Icons | 9000+ | `mat-` | google/material-design-icons |

## 文件结构

```
assets/icons/
  ant-design-icons.svg   (已有)
  element-plus-icons.svg (已有)
  lucide-icons.svg      (新增)
  heroicons.svg         (新增)
  phosphor-icons.svg     (新增)
  tabler-icons.svg      (新增)
  fontawesome-icons.svg  (新增)
  material-icons.svg     (新增)
  icons.css
  index.html
```

## 约束

- 只收集图标，不改现有代码
- main.html 暂不更新

## 实现步骤

1. 克隆各图标库仓库
2. 提取 SVG 并转换为 `<symbol>` 格式
3. 更新预览页面支持所有图标库分类展示
4. 提交推送