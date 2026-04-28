# 扩展图标库实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**目标：** 收集 Lucide、Heroicons、Phosphor、Tabler、Font Awesome、Material Icons 共6个图标库

**架构：** 克隆各图标库仓库，提取 SVG 转换为 Sprite 格式

---

## 任务列表

### Task 1: 提取 Lucide Icons

- [ ] Step 1: 克隆 lucide-icons/lucide 仓库
- [ ] Step 2: 检查 SVG 文件位置
- [ ] Step 3: 创建并运行 Node.js 脚本转换为 Sprite 格式
- [ ] Step 4: 生成 `assets/icons/lucide-icons.svg`
- [ ] Step 5: 清理临时文件

### Task 2: 提取 Heroicons

- [ ] Step 1: 克隆 tailwindlabs/heroicons 仓库
- [ ] Step 2: 检查 SVG 文件位置 (24/solid 或 24/outline)
- [ ] Step 3: 创建并运行 Node.js 脚本
- [ ] Step 4: 生成 `assets/icons/heroicons.svg`
- [ ] Step 5: 清理临时文件

### Task 3: 提取 Phosphor Icons

- [ ] Step 1: 克隆 phosphor-icons/phosphor-icons 仓库
- [ ] Step 2: 检查 SVG 文件位置 (regular 目录)
- [ ] Step 3: 创建并运行 Node.js 脚本
- [ ] Step 4: 生成 `assets/icons/phosphor-icons.svg`
- [ ] Step 5: 清理临时文件

### Task 4: 提取 Tabler Icons

- [ ] Step 1: 克隆 tabler/tabler-icons 仓库
- [ ] Step 2: 检查 SVG 文件位置 (icons directory)
- [ ] Step 3: 创建并运行 Node.js 脚本
- [ ] Step 4: 生成 `assets/icons/tabler-icons.svg`
- [ ] Step 5: 清理临时文件

### Task 5: 提取 Font Awesome

- [ ] Step 1: 克隆 FortAwesome/Font-Awesome 仓库
- [ ] Step 2: 检查 SVG 文件位置 (sprites/)
- [ ] Step 3: 创建并运行 Node.js 脚本
- [ ] Step 4: 生成 `assets/icons/fontawesome-icons.svg`
- [ ] Step 5: 清理临时文件

### Task 6: 提取 Material Icons

- [ ] Step 1: 克隆 google/material-design-icons 仓库
- [ ] Step 2: 检查 SVG 文件位置 (maps/, notification/, etc)
- [ ] Step 3: 创建并运行 Node.js 脚本
- [ ] Step 4: 生成 `assets/icons/material-icons.svg`
- [ ] Step 5: 清理临时文件

### Task 7: 更新预览页面

- [ ] Step 1: 更新 `assets/icons/index.html` 支持所有图标库分类展示
- [ ] Step 2: 提交

### Task 8: 修复 SVG 问题并提交

- [ ] Step 1: 修复 DOCTYPE 问题（如有）
- [ ] Step 2: 提交所有新图标库文件
- [ ] Step 3: git push

---

## 图标 ID 前缀

| 图标库 | 前缀 | 示例 |
|--------|------|------|
| Ant Design | `ant-` | `ant-user` |
| Element Plus | `el-` | `el-user` |
| Lucide | `lucide-` | `lucide-user` |
| Heroicons | `hero-` | `hero-user` |
| Phosphor | `ph-` | `ph-user` |
| Tabler | `tabler-` | `tabler-user` |
| Font Awesome | `fa-` | `fa-user` |
| Material | `mat-` | `mat-user` |