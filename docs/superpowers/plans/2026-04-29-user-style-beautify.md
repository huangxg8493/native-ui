# 用户管理页面风格美化 - 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 user.html 风格与 address.html 保持一致，user.css 完全独立，不引用 address.css

**Architecture:** user.css 完全独立编写，样式与 address.css 对齐，user.html 仅引入 user.css

**Tech Stack:** 原生 CSS（无框架）

---

## 文件结构

| 文件 | 职责 |
|------|------|
| `html/sys/user.html` | 添加标题 `<h1>用户管理</h1>` |
| `assets/css/user.css` | 完全独立，样式与 address.css 对齐 |
| `assets/css/address.css` | 无需修改（仅供参考） |

---

## 修改详情

### Task 1: 重写 user.css 与 address.css 对齐

**文件:** Modify: `assets/css/user.css`

**步骤:**

- [ ] **Step 1: 将 user.css 内容完全替换**

完全参考 address.css 的样式，重新编写 user.css，保留 user 页面专用样式（.editBtn、.deleteBtn、.roleBtn、.role-item、#roleList）。

**完整 user.css 内容：**

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: "Microsoft YaHei", Arial, sans-serif;
    background-color: #f5f5f5;
}

.container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
    margin-bottom: 20px;
    color: #333;
}

.search-bar {
    margin-bottom: 20px;
}

.search-bar-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.search-bar-row label {
    margin-right: 8px;
    font-weight: 500;
    color: #333;
}

.search-bar input {
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    width: 200px;
    font-size: 14px;
    transition: border-color 0.3s, box-shadow 0.3s;
}

.search-bar input:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    outline: none;
}

.search-bar select {
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    width: auto;
    font-size: 14px;
    transition: border-color 0.3s, box-shadow 0.3s;
}

.search-bar select:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    outline: none;
}

.search-bar button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

#queryBtn {
    background-color: #1890ff;
    color: white;
    margin-left: 10px;
}

#queryBtn:hover {
    background-color: #40a9ff;
}

#addBtn {
    background-color: #52c41a;
    color: white;
}

#addBtn:hover {
    background-color: #73d13d;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
}

th {
    background-color: #fafafa;
    font-weight: 600;
}

.pagination {
    display: flex;
    align-items: center;
    gap: 15px;
    justify-content: flex-end;
}

.pagination button {
    padding: 6px 12px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
}

.pagination button:disabled {
    color: #ccc;
    cursor: not-allowed;
}

.pagination select {
    padding: 6px 8px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
}

.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 30px;
    border-radius: 8px;
    width: 400px;
}

.modal-content h2 {
    margin-bottom: 20px;
}

.form-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 15px;
}

.form-row label {
    width: 80px;
    line-height: 32px;
    font-weight: 500;
}

.form-row input,
.form-row select,
.form-row textarea {
    flex: 1;
    padding: 8px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
}

.form-row textarea {
    resize: vertical;
}

.form-actions {
    text-align: right;
    margin-top: 20px;
}

.form-actions button {
    padding: 8px 20px;
    margin-left: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

#cancelBtn,
#roleCancelBtn {
    background-color: #999;
    color: white;
}

#cancelBtn:hover,
#roleCancelBtn:hover {
    background-color: #888;
}

.form-actions button[type="submit"],
#roleConfirmBtn {
    background-color: #1890ff;
    color: white;
}

.form-actions button[type="submit"]:hover,
#roleConfirmBtn:hover {
    background-color: #40a9ff;
}

/* user 页面专用样式 */
.editBtn, .deleteBtn, .roleBtn {
    padding: 4px 8px;
    margin-right: 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.editBtn, .roleBtn {
    background-color: #1890ff;
    color: white;
}

.editBtn:hover, .roleBtn:hover {
    background-color: #40a9ff;
}

.deleteBtn {
    background-color: #ff4d4f;
    color: white;
}

.deleteBtn:hover {
    background-color: #ff7875;
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

.role-item input {
    margin-right: 8px;
}

.role-item label {
    cursor: pointer;
}

#roleList {
    margin: 15px 0;
    max-height: 300px;
    overflow-y: auto;
}

.toast {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    z-index: 10000;
}

.toast.success { background: #52c41a; }
.toast.error { background: #ff4d4f; }
.toast.info { background: #1890ff; }

@keyframes toastIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes toastOut {
    from { opacity: 1; }
    to { opacity: 0; }
}
```

---

## 自检清单

- [ ] user.html 添加了 `<h1>用户管理</h1>` 标题
- [ ] user.css 完全独立，不引用 address.css
- [ ] user.css 样式与 address.css 对齐（容器、搜索栏、表格、弹窗、按钮）
- [ ] user.css 保留了 user 页面专用样式（.editBtn、.deleteBtn、.roleBtn、.role-item、#roleList）
- [ ] address.css 无需修改

---

## 注意事项

1. user.css 完全独立，不使用 @import 引入 address.css
2. user.css 需要覆盖所有通用样式（容器、搜索栏、表格、弹窗等）
3. user.css 需要保留 user 页面专用样式

---

**Plan complete.** 保存于 `docs/superpowers/plans/2026-04-29-user-style-beautify.md`

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**