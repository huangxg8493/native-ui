# 用户密码重置功能实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 user.html 中的"修改密码"功能改为"重置密码"功能，管理员可直接重置用户密码为默认密码 123456

**Architecture:** 移除密码修改弹窗，改为点击重置按钮后直接 confirm 确认，然后调用重置接口

**Tech Stack:** 原生 HTML/CSS/JavaScript（无框架）

---

## 文件映射

| 文件 | 操作 |
|------|------|
| `html/sys/user.html` | 修改：删除密码弹窗，更新按钮文案 |
| `assets/script/user.js` | 修改：移除密码表单逻辑，改造重置按钮事件处理 |

---

## 任务

### Task 1: 修改 user.html

**Files:**
- Modify: `html/sys/user.html:104-129`（删除密码弹窗）
- Modify: `html/sys/user.html:320`（按钮文案）

- [ ] **Step 1: 删除密码弹窗 HTML**

定位到第 104-129 行，删除整个 `#passwordModal` 弹窗 HTML：
```html
<!-- 修改密码弹窗 -->
<div id="passwordModal" class="modal">
    ... 整个弹窗内容
</div>
```

- [ ] **Step 2: 修改按钮文案**

在第 320 行附近找到：
```html
<button class="changePwdBtn btn" style="background-color:#faad14" data-userid="' + user.userId + '" data-phone="' + escapeHtml(user.phone) + '">修改密码</button>
```
改为：
```html
<button class="changePwdBtn btn" style="background-color:#faad14" data-userid="' + user.userId + '" data-phone="' + escapeHtml(user.phone) + '">重置密码</button>
```

- [ ] **Step 3: 提交**

```bash
git add html/sys/user.html
git commit -m "feat(user): 将修改密码改为重置密码功能"
```

---

### Task 2: 修改 user.js

**Files:**
- Modify: `assets/script/user.js:237-284`（移除密码表单逻辑）
- Modify: `assets/script/user.js:137-147`（改造重置按钮点击事件）

- [ ] **Step 1: 修改 changePwdBtn 点击事件**

将第 137-147 行：
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

改为：
```javascript
if (target.classList.contains('changePwdBtn')) {
    var userId = parseInt(target.dataset.userid);
    var phone = target.dataset.phone;
    if (!confirm('确定要重置该用户密码吗？重置后密码为 123456')) return;
    request('/api/users/' + userId + '/password/reset', 'POST', { newPassword: '123456' }).then(function(res) {
        if (res.code === '000000') {
            showToast('重置成功，密码已重置为 123456', 'success');
        } else {
            showToast(res.message || '重置失败', 'error');
        }
    }).catch(function(err) {
        showToast('网络错误', 'error');
    });
}
```

- [ ] **Step 2: 删除密码表单相关代码**

删除第 237-284 行的 `passwordForm` 提交逻辑和取消按钮事件，以及 `passwordCancelBtn` 的点击事件。

删除后弹窗背景点击关闭的数组也需要移除 `passwordModal`：
```javascript
['userModal', 'roleModal', 'passwordModal'].forEach(...)
```
改为：
```javascript
['userModal', 'roleModal'].forEach(...)
```

- [ ] **Step 3: 提交**

```bash
git add assets/script/user.js
git commit -m "feat(user): 重置密码功能实现"
```

---

## 验证

1. 在浏览器打开 user.html
2. 找到任意用户的"重置密码"按钮并点击
3. 确认弹出确认框提示"重置后密码为 123456"
4. 点击确定后，验证 Toast 提示"重置成功，密码已重置为 123456"