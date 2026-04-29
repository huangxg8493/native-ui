# 修改密码功能独立化实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将用户管理中的密码修改功能从编辑弹窗独立出来，新增独立的修改密码按钮和弹窗。

**Architecture:**
- 编辑弹窗移除密码字段，仅保留基本信息编辑
- 新增修改密码弹窗，包含原密码、新密码、确认密码三个字段
- 修改密码成功后 2 秒跳转到登录页
- 操作列增加"修改密码"按钮

**Tech Stack:** 原生 HTML/CSS/JavaScript，IIFE 模式，fetch API

---

## 文件结构

| 文件 | 改动 |
|------|------|
| `html/sys/user.html` | 编辑弹窗移除密码行；新增修改密码弹窗 HTML |
| `assets/script/user.js` | 编辑逻辑移除密码处理；新增修改密码弹窗打开/提交/关闭逻辑 |
| `assets/css/user.css` | 新增修改密码弹窗样式 |

---

## Task 1: HTML 修改 - 移除编辑弹窗密码行，新增修改密码弹窗

**Files:**
- Modify: `html/sys/user.html:53-56`（移除密码行）、`html/sys/user.html:92-102`（新增修改密码弹窗）

- [ ] **Step 1: 移除编辑弹窗中的密码字段行（第53-56行）**

删除以下 HTML：
```html
<div class="form-row">
    <label>密码</label>
    <input type="password" id="formPassword">
</div>
```

- [ ] **Step 2: 在 `</div><!-- /userModal -->` 之前新增修改密码弹窗**

在 `roleModal` 之后、`toast` 之前添加：
```html
<!-- 修改密码弹窗 -->
<div id="passwordModal" class="modal">
    <div class="modal-content">
        <h2 id="passwordModalTitle">修改密码</h2>
        <form id="passwordForm">
            <input type="hidden" id="formPwdUserId">
            <input type="hidden" id="formPwdPhone">
            <div class="form-row">
                <label>原密码</label>
                <input type="password" id="formOldPassword">
            </div>
            <div class="form-row">
                <label>修改密码</label>
                <input type="password" id="formNewPassword">
            </div>
            <div class="form-row">
                <label>确认密码</label>
                <input type="password" id="formConfirmPassword">
            </div>
            <div class="form-actions">
                <button type="button" id="passwordCancelBtn">取消</button>
                <button type="submit">确定</button>
            </div>
        </form>
    </div>
</div>
```

- [ ] **Step 3: 提交**

```bash
git add html/sys/user.html
git commit -m "feat: 移除编辑弹窗密码字段，新增修改密码弹窗"
```

---

## Task 2: JS 修改 - 编辑逻辑移除密码处理，操作列增加修改密码按钮

**Files:**
- Modify: `assets/script/user.js:260-264`（操作列按钮）、`assets/script/user.js:93-112`（编辑回填逻辑）、`assets/script/user.js:140-188`（表单提交逻辑）

- [ ] **Step 1: 操作列增加修改密码按钮**

当前代码（第260-264行）：
```javascript
'<td>' +
    '<button class="editBtn btn" data-userid="' + user.userId + '">编辑</button>' +
    '<button class="deleteBtn btn" style="background-color:#ff4d4f" data-userid="' + user.userId + '">删除</button>' +
    '<button class="roleBtn btn" data-userid="' + user.userId + '" data-phone="' + escapeHtml(user.phone) + '">分配角色</button>' +
'</td>' +
```

修改为：
```javascript
'<td>' +
    '<button class="editBtn btn" data-userid="' + user.userId + '">编辑</button>' +
    '<button class="changePwdBtn btn" style="background-color:#faad14" data-userid="' + user.userId + '" data-phone="' + escapeHtml(user.phone) + '">修改密码</button>' +
    '<button class="deleteBtn btn" style="background-color:#ff4d4f" data-userid="' + user.userId + '">删除</button>' +
    '<button class="roleBtn btn" data-userid="' + user.userId + '" data-phone="' + escapeHtml(user.phone) + '">分配角色</button>' +
'</td>' +
```

- [ ] **Step 2: 编辑回填逻辑移除密码相关代码**

当前代码（第93-112行）中删除或注释掉以下代码：
```javascript
document.getElementById('formPassword').value = '';
document.getElementById('formPassword').parentElement.querySelector('label').textContent = '密码（不填则不修改）';
```

编辑弹窗中不再需要密码相关的重置和提示文字。

- [ ] **Step 3: 表单提交逻辑移除 password 处理**

当前代码（第153-162行）中的 payload 构建逻辑：
```javascript
var payload = {
    phone: phone,
    status: status,
    userName: document.getElementById('formUserName').value.trim(),
    email: document.getElementById('formEmail').value.trim(),
    city: document.getElementById('formCity').value.trim()
};
if (userId) {
    payload.userId = parseInt(userId);
    if (password) payload.password = password;  // 删除此行
```

删除 `if (password) payload.password = password;` 这一行。编辑时不再允许修改密码。

- [ ] **Step 4: 提交**

```bash
git add assets/script/user.js
git commit -m "feat: 编辑弹窗移除密码字段，操作列增加修改密码按钮"
```

---

## Task 3: JS 修改 - 新增修改密码弹窗的事件绑定和提交逻辑

**Files:**
- Modify: `assets/script/user.js`（bindEvents 函数中新增修改密码相关逻辑）

- [ ] **Step 1: 在 bindEvents 函数中新增修改密码按钮点击处理**

在 `bindEvents` 函数中，找到角色按钮的 `roleBtn` 处理之后，添加：
```javascript
if (target.classList.contains('changePwdBtn')) {
    currentUserId = parseInt(userId);
    var phone = target.dataset.phone;
    document.getElementById('passwordModalTitle').textContent = '修改密码';
    document.getElementById('formPwdUserId').value = userId;
    document.getElementById('formPwdPhone').value = phone;
    document.getElementById('formOldPassword').value = '';
    document.getElementById('formNewPassword').value = '';
    document.getElementById('formConfirmPassword').value = '';
    document.getElementById('passwordModal').style.display = 'flex';
}
```

- [ ] **Step 2: 新增修改密码表单提交逻辑**

在 `bindEvents` 函数末尾（分页逻辑之后、弹窗背景点击关闭之前）添加：
```javascript
// 修改密码表单提交
document.getElementById('passwordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var userId = document.getElementById('formPwdUserId').value;
    var phone = document.getElementById('formPwdPhone').value.trim();
    var oldPassword = document.getElementById('formOldPassword').value;
    var newPassword = document.getElementById('formNewPassword').value;
    var confirmPassword = document.getElementById('formConfirmPassword').value;

    if (!oldPassword) {
        showToast('请输入原密码', 'error');
        return;
    }
    if (!newPassword || newPassword.length < 6) {
        showToast('密码最少6位', 'error');
        return;
    }
    if (newPassword !== confirmPassword) {
        showToast('两次密码输入不一致', 'error');
        return;
    }

    var payload = {
        userId: parseInt(userId),
        phone: phone,
        password: oldPassword,
        newPassword: newPassword
    };

    request('/api/users/update/pwd', 'POST', payload).then(function(res) {
        if (res.code === '000000') {
            showToast('密码修改成功，即将跳转到登录页', 'success');
            document.getElementById('passwordModal').style.display = 'none';
            setTimeout(function() {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showToast(res.message || '修改失败', 'error');
        }
    }).catch(function(err) {
        showToast('网络错误', 'error');
    });
});

// 修改密码取消
document.getElementById('passwordCancelBtn').addEventListener('click', function() {
    document.getElementById('passwordModal').style.display = 'none';
});
```

- [ ] **Step 3: 在弹窗背景点击关闭逻辑中添加 passwordModal**

将 `['userModal', 'roleModal'].forEach` 修改为 `['userModal', 'roleModal', 'passwordModal'].forEach`。

- [ ] **Step 4: 提交**

```bash
git add assets/script/user.js
git commit -m "feat: 新增修改密码弹窗的事件绑定和提交逻辑"
```

---

## Task 4: CSS 修改 - 新增修改密码弹窗样式

**Files:**
- Modify: `assets/css/user.css`

- [ ] **Step 1: 新增修改密码按钮样式**

添加：
```css
/* 修改密码按钮 */
.changePwdBtn {
    background-color: #faad14 !important;
    color: #fff !important;
    border: none;
    padding: 4px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 4px;
}
```

- [ ] **Step 2: 提交**

```bash
git add assets/css/user.css
git commit -m "feat: 新增修改密码按钮样式"
```

---

## Task 5: 整体测试

**验证步骤：**

1. 打开用户管理页面，确认操作列有4个按钮：编辑、修改密码、删除、分配角色
2. 点击"编辑"按钮，确认弹窗中没有密码字段
3. 编辑用户信息并保存，确认成功
4. 点击"修改密码"按钮，确认弹窗包含：原密码、修改密码、确认密码
5. 输入不匹配的确认密码，确认提示"两次密码输入不一致"
6. 输入正确格式的密码，确认修改成功并2秒后跳转到登录页
