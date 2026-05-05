# 全局缩放 80% 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将所有 CSS 文件和 HTML 内联样式中的 px 值和 % 值全部缩小 20%（乘 0.8，四舍五入取整）

**Architecture:** 纯机械替换，每个文件独立处理，每文件 commit 一次便于回退

**Tech Stack:** 手动编辑 CSS 和 HTML 文件

---

## 缩放计算规则

| 原值 | 计算 | 取整后 |
|------|------|--------|
| `16px` | 16×0.8=12.8 | `13px` |
| `100%` | 100×0.8=80 | `80%` |
| `1px` | 1×0.8=0.8 | `1px` |
| `0px` | 0×0.8=0 | `0px` |

---

## 文件清单与任务拆分

每个 CSS/HTML 文件为一个 Task，共 8 个任务。

### Task 1: `assets/css/icons.css`

**涉及文件:**
- 修改: `assets/css/icons.css`

**步骤:**
- [ ] Step 1: 读取 `assets/css/icons.css`，找到所有 px 和 % 值，乘 0.8 取整，写回文件
- [ ] Step 2: git add assets/css/icons.css && git commit -m "style(icons): 全局缩放 80%"

---

### Task 2: `assets/icons/icons.css`

**涉及文件:**
- 修改: `assets/icons/icons.css`

**步骤:**
- [ ] Step 1: 读取 `assets/icons/icons.css`，找到所有 px 和 % 值，乘 0.8 取整，写回文件
- [ ] Step 2: git add assets/icons/icons.css && git commit -m "style(icons): 全局缩放 80%"

---

### Task 3: `assets/css/login.css`

**涉及文件:**
- 修改: `assets/css/login.css`

**步骤:**
- [ ] Step 1: 读取 `assets/css/login.css`，找到所有 px 和 % 值，乘 0.8 取整，写回文件
- [ ] Step 2: git add assets/css/login.css && git commit -m "style(login): 全局缩放 80%"

---

### Task 4: `assets/css/address.css`

**涉及文件:**
- 修改: `assets/css/address.css`

**步骤:**
- [ ] Step 1: 读取 `assets/css/address.css`，找到所有 px 和 % 值，乘 0.8 取整，写回文件
- [ ] Step 2: git add assets/css/address.css && git commit -m "style(address): 全局缩放 80%"

---

### Task 5: `assets/css/user.css`

**涉及文件:**
- 修改: `assets/css/user.css`

**步骤:**
- [ ] Step 1: 读取 `assets/css/user.css`，找到所有 px 和 % 值，乘 0.8 取整，写回文件
- [ ] Step 2: git add assets/css/user.css && git commit -m "style(user): 全局缩放 80%"

---

### Task 6: `assets/css/home.css`

**涉及文件:**
- 修改: `assets/css/home.css`

**步骤:**
- [ ] Step 1: 读取 `assets/css/home.css`，找到所有 px 和 % 值，乘 0.8 取整，写回文件
- [ ] Step 2: git add assets/css/home.css && git commit -m "style(home): 全局缩放 80%"

---

### Task 7: `html/main.html`（内联样式）

**涉及文件:**
- 修改: `html/main.html`

**步骤:**
- [ ] Step 1: 读取 `html/main.html`，找到所有内联 style 中的 px 和 % 值，乘 0.8 取整
- [ ] Step 2: git add html/main.html && git commit -m "style(main): 全局缩放 80%"

---

### Task 8: 其他 HTML 文件内联样式

**涉及文件:**
- 修改: `html/home/home.html`
- 修改: `html/login/login.html`
- 修改: `html/login/register.html`
- 修改: `html/client/address.html`
- 修改: `html/sys/user.html`

**步骤:**
- [ ] Step 1: 读取每个文件，找到内联 style 中的 px 和 % 值，乘 0.8 取整
- [ ] Step 2: git add 所有修改的 HTML 文件 && git commit -m "style: 全局缩放 80%（其他页面）"

---

## 验证步骤

每个 CSS 文件改完后，刷新页面确认：
1. 布局是否正常（无元素溢出、无遮挡）
2. 各模块（登录页、地址管理、用户管理、首页）显示正常
3. 按钮、输入框、表格等交互元素大小合适
