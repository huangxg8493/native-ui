# register.html 接口字段调整实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 调整 register.html 表单结构，适配新的用户注册接口字段

**Architecture:** 移除省份/城市/区县三个字段，替换为城市+地址详情两个字段，调整表单顺序，更新 JS 逻辑

**Tech Stack:** 原生 HTML/JavaScript

---

## 文件变更

- Modify: `html/login/register.html` — 表单结构调整和 JS 逻辑更新

---

### Task 1: 调整 register.html HTML 结构

**Files:**
- Modify: `html/login/register.html:32-54`

- [ ] **Step 1: 移除省份输入框**

移除第 38-41 行（省份province输入框）

```html
<!-- 移除 -->
<div class="form-group">
    <label for="province">省份</label>
    <input type="text" id="province" name="province" placeholder="请输入省份">
</div>
```

- [ ] **Step 2: 修改城市输入框**

将第 42-45 行城市输入框的 id 从 city 改为 city（保持不变），但 label 改为"城市"

- [ ] **Step 3: 移除区县输入框**

移除第 46-49 行（区县district输入框）

- [ ] **Step 4: 在城市后面新增地址详情输入框**

在城市输入框之后（第 45 行后）插入地址详情输入框：

```html
<div class="form-group">
    <label for="addrDetail">地址详情</label>
    <input type="text" id="addrDetail" name="addrDetail" placeholder="请输入地址详情">
</div>
```

- [ ] **Step 5: 提交 HTML 修改**

```bash
git add html/login/register.html
git commit -m "feat: register.html移除省份区县字段，新增地址详情"
```

---

### Task 2: 调整 register.html JS 逻辑

**Files:**
- Modify: `html/login/register.html:118-190`

- [ ] **Step 1: 移除 province/city/district 变量**

将第 126-129 行：
```js
var province = document.getElementById('province').value.trim();
var city = document.getElementById('city').value.trim();
var district = document.getElementById('district').value.trim();
```

替换为：
```js
var city = document.getElementById('city').value.trim();
var addrDetail = document.getElementById('addrDetail').value.trim();
```

- [ ] **Step 2: 更新 registerData payload**

将第 179-189 行：
```js
var registerData = {
    phone: phone,
    userName: userName,
    email: email,
    password: password,
    province: province,
    city: city,
    district: district,
    hobby: hobby
};
```

替换为：
```js
var registerData = {
    phone: phone,
    userName: userName,
    email: email,
    city: city,
    addrDetail: addrDetail,
    hobby: hobby,
    password: password
};
```

- [ ] **Step 3: 提交 JS 修改**

```bash
git commit -m "feat: register.html更新JS逻辑，适配新接口字段"
```

---

### Task 3: 验证

**Files:**
- Test: `html/login/register.html`

- [ ] **Step 1: 在浏览器中打开 register.html 验证**

打开 `html/login/register.html`，检查：
- 表单显示城市和地址详情两个字段
- 不再显示省份和区县字段
- 提交时 console 中查看 payload 是否正确
