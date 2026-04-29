# 用户管理页面字段补全实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 `html/sys/user.html` 补全表格和新增/编辑弹窗缺失的字段

**Architecture:** 仅修改两个现有文件：HTML 表格表头/弹窗表单 + JS 渲染逻辑，无新增文件

**Tech Stack:** 原生 HTML/CSS/JavaScript，IIFE 模式

---

## 文件改动概览

| 文件 | 改动内容 |
|------|----------|
| `html/sys/user.html` | 表格表头（8→9列）、空数据提示 colspan、弹窗表单（增加创建/更新时间只读字段） |
| `assets/script/user.js` | `renderTable()`：省市列改取 city、新增更新时间列、空数据 colspan 8→9 |

---

## Task 1: 修改表格表头

**Files:**
- Modify: `html/sys/user.html:19-27`

- [ ] **Step 1: 修改表头**

将 `<th>省市</th>` 改为 `<th>省市区</th>`，在"创建时间"后新增 `<th>更新时间</th>`，操作列前移。最终表头：

```html
<tr>
    <th>序号</th><th>手机号</th><th>用户名</th><th>邮箱</th>
    <th>省市区</th><th>状态</th><th>创建时间</th><th>更新时间</th><th>操作</th>
</tr>
```

- [ ] **Step 2: 修改空数据提示 colspan**

第 225 行左右：
```javascript
tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#999">暂无数据</td></tr>';
```
（原来 colspan="8"）

- [ ] **Step 3: 提交**

```bash
git add html/sys/user.html
git commit -m "feat: user表格表头增加省市区(取city)、更新时间字段"
```

---

## Task 2: 修改 JS 渲染逻辑

**Files:**
- Modify: `assets/script/user.js:221-251` (renderTable 函数)

- [ ] **Step 1: 修改 renderTable() 函数**

改动点：
1. `provinceCity` 变量改为取 `user.city`（原来是 `[user.province, user.city]`）
2. 新增更新时间列 `'<td>' + formatTime(user.updateTime) + '</td>'`
3. colspan 8 → 9

修改后的 renderTable 关键行：

```javascript
// 省市列改为只取 city
var provinceCity = user.city || '-';

// 新增更新时间列（在创建时间后、操作前）
'<td>' + formatTime(user.updateTime) + '</td>' +

// 操作列
'<td>' +
    '<button class="editBtn btn" data-userid="' + user.userId + '">编辑</button>' +
    '<button class="deleteBtn btn" style="background-color:#ff4d4f" data-userid="' + user.userId + '">删除</button>' +
    '<button class="roleBtn btn" data-userid="' + user.userId + '" data-phone="' + escapeHtml(user.phone) + '">分配角色</button>' +
'</td>'
```

完整 renderTable 数据行构建：

```javascript
data.forEach(function(user, i) {
    var provinceCity = user.city || '-';
    var statusHtml = user.status === 'Y'
        ? '<span style="color:#52c41a;font-weight:bold">正常</span>'
        : '<span style="color:#ff4d4f;font-weight:bold">禁用</span>';
    html += '<tr>' +
        '<td>' + (start + i) + '</td>' +
        '<td>' + escapeHtml(user.phone) + '</td>' +
        '<td>' + escapeHtml(user.userName || '-') + '</td>' +
        '<td>' + escapeHtml(user.email || '-') + '</td>' +
        '<td>' + escapeHtml(provinceCity) + '</td>' +
        '<td>' + statusHtml + '</td>' +
        '<td>' + formatTime(user.createTime) + '</td>' +
        '<td>' + formatTime(user.updateTime) + '</td>' +
        '<td>' +
            '<button class="editBtn btn" data-userid="' + user.userId + '">编辑</button>' +
            '<button class="deleteBtn btn" style="background-color:#ff4d4f" data-userid="' + user.userId + '">删除</button>' +
            '<button class="roleBtn btn" data-userid="' + user.userId + '" data-phone="' + escapeHtml(user.phone) + '">分配角色</button>' +
        '</td>' +
        '</tr>';
});
```

- [ ] **Step 2: 提交**

```bash
git add assets/script/user.js
git commit -m "feat: user.js渲染逻辑增加更新时间列，省市列改取city"
```

---

## Task 3: 修改新增/编辑弹窗

**Files:**
- Modify: `html/sys/user.html:44-70` (userModal 表单)

- [ ] **Step 1: 在 userForm 中增加用户名、邮箱、省市区、创建时间、更新时间字段**

当前弹窗只有：手机号、密码、状态。需要新增：用户名、邮箱、省市区（取 city）、创建时间（只读）、更新时间（只读）

在密码字段后、状态字段前插入用户名和邮箱；在状态字段后插入省市区；在弹窗底部（form-actions 前）插入创建时间和更新时间只读字段。

修改后的表单结构：

```html
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
        <label>用户名</label>
        <input type="text" id="formUserName">
    </div>
    <div class="form-row">
        <label>邮箱</label>
        <input type="text" id="formEmail">
    </div>
    <div class="form-row">
        <label>省市区</label>
        <input type="text" id="formCity" placeholder="请输入城市">
    </div>
    <div class="form-row">
        <label>状态</label>
        <select id="formStatus">
            <option value="Y">正常</option>
            <option value="N">禁用</option>
        </select>
    </div>
    <div class="form-row">
        <label>创建时间</label>
        <input type="text" id="formCreateTime" readonly>
    </div>
    <div class="form-row">
        <label>更新时间</label>
        <input type="text" id="formUpdateTime" readonly>
    </div>
    <div class="form-actions">
        <button type="button" id="cancelBtn">取消</button>
        <button type="submit">确定</button>
    </div>
</form>
```

- [ ] **Step 2: 提交**

```bash
git add html/sys/user.html
git commit -m "feat: user弹窗表单增加用户名、邮箱、省市区(取city)、创建/更新时间只读字段"
```

---

## Task 4: 修改 JS 表单回填逻辑

**Files:**
- Modify: `assets/script/user.js:83-103` (编辑按钮点击处理)

- [ ] **Step 1: 修改编辑回填逻辑**

当前编辑回填只设置了 phone 和 status，需要增加：userName、email、city（省市区）、createTime、updateTime

编辑回填代码修改：

```javascript
if (target.classList.contains('editBtn')) {
    currentUserId = parseInt(userId);
    document.getElementById('modalTitle').textContent = '编辑用户';
    document.getElementById('formUserId').value = userId;
    var row = target.closest('tr');
    var cells = row.cells;
    // 序号=0, 手机号=1, 用户名=2, 邮箱=3, 省市区=4, 状态=5, 创建时间=6, 更新时间=7, 操作=8
    document.getElementById('formPhone').value = cells[1].textContent.trim();
    document.getElementById('formPhone').readOnly = true;
    document.getElementById('formPassword').value = '';
    document.getElementById('formPassword').parentElement.querySelector('label').textContent = '密码（不填则不修改）';
    document.getElementById('formUserName').value = cells[2].textContent.trim();
    document.getElementById('formEmail').value = cells[3].textContent.trim();
    document.getElementById('formCity').value = cells[4].textContent.trim();
    var statusCell = cells[5].textContent.trim();
    document.getElementById('formStatus').value = statusCell === '正常' ? 'Y' : 'N';
    document.getElementById('formCreateTime').value = cells[6].textContent.trim();
    document.getElementById('formUpdateTime').value = cells[7].textContent.trim();
    document.getElementById('userModal').style.display = 'flex';
}
```

- [ ] **Step 2: 修改新增时表单重置逻辑**

在 addBtn 点击处理中（第 70-80 行），新增时需重置新增的字段：

```javascript
document.getElementById('addBtn').addEventListener('click', function() {
    currentUserId = null;
    document.getElementById('modalTitle').textContent = '新增用户';
    document.getElementById('formUserId').value = '';
    document.getElementById('formPhone').value = '';
    document.getElementById('formPhone').readOnly = false;
    document.getElementById('formPassword').value = '';
    document.getElementById('formPassword').parentElement.querySelector('label').textContent = '密码';
    document.getElementById('formUserName').value = '';
    document.getElementById('formEmail').value = '';
    document.getElementById('formCity').value = '';
    document.getElementById('formStatus').value = 'Y';
    document.getElementById('formCreateTime').value = '-';
    document.getElementById('formUpdateTime').value = '-';
    document.getElementById('userModal').style.display = 'flex';
});
```

- [ ] **Step 3: 修改表单提交 payload**

在 userForm submit 处理中（第 131-172 行），payload 需要增加 userName、email、city 字段：

```javascript
var payload = {
    phone: phone,
    status: status,
    userName: document.getElementById('formUserName').value.trim(),
    email: document.getElementById('formEmail').value.trim(),
    city: document.getElementById('formCity').value.trim()
};
```

- [ ] **Step 4: 提交**

```bash
git add assets/script/user.js
git commit -m "feat: user.js表单回填和提交增加用户名、邮箱、省市区字段"
```

---

## 自检清单

- [ ] Task1: 表格表头 9 列，省市区取 city，更新时间在创建时间后
- [ ] Task1: 空数据提示 colspan=9
- [ ] Task2: renderTable 省市列只取 user.city
- [ ] Task2: renderTable 新增更新时间列（formatTime(user.updateTime)）
- [ ] Task3: 弹窗表单有用户名、邮箱、省市区（city）、状态、创建时间（只读）、更新时间（只读）
- [ ] Task4: 编辑回填所有 8 个字段
- [ ] Task4: 新增时重置所有字段，创建/更新时间显示 "-"
- [ ] Task4: 提交 payload 包含 userName、email、city

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-29-user-fields-implementation.md`**

两个执行选项：

**1. Subagent-Driven (recommended)** - 每个 Task 分配独立 subagent，任务间有 review checkpoint

**2. Inline Execution** - 在当前 session 执行，batch 模式带检查点

选择哪个？