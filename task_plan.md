# 用户密码重置功能实施计划

## 目标

将 user.html 中的"修改密码"功能改为"重置密码"功能，管理员可直接重置用户密码为默认密码 123456

## 架构

移除密码修改弹窗，改为点击重置按钮后直接 confirm 确认，然后调用重置接口

## 技术栈

原生 HTML/CSS/JavaScript（无框架）

---

## 文件映射

| 文件 | 操作 |
|------|------|
| `html/sys/user.html` | 修改：删除密码弹窗，更新按钮文案 |
| `assets/script/user.js` | 修改：移除密码表单逻辑，改造重置按钮事件处理 |

---

## 任务清单

### Task 1: 修改 user.html

**涉及文件:**
- 修改: `html/sys/user.html:104-129`（删除密码弹窗）
- 修改: `html/sys/user.html:320`（按钮文案）

**步骤:**
- [ ] Step 1: 删除密码弹窗 HTML（删除 #passwordModal）
- [ ] Step 2: 修改按钮文案（"修改密码" → "重置密码"）
- [ ] Step 3: git add html/sys/user.html && git commit -m "feat(user): 将修改密码改为重置密码功能"

### Task 2: 修改 user.js

**涉及文件:**
- 修改: `assets/script/user.js:137-147`（改造重置按钮点击事件）
- 修改: `assets/script/user.js:237-284`（删除密码表单逻辑）

**步骤:**
- [ ] Step 1: 修改 changePwdBtn 点击事件（confirm + 调用重置接口）
- [ ] Step 2: 删除密码表单相关代码（passwordForm、passwordCancelBtn、弹窗关闭数组中的 passwordModal）
- [ ] Step 3: git add assets/script/user.js && git commit -m "feat(user): 重置密码功能实现"

---

## 验证步骤

1. 在浏览器打开 user.html
2. 找到任意用户的"重置密码"按钮并点击
3. 确认弹出确认框提示"重置后密码为 123456"
4. 点击确定后，验证 Toast 提示"重置成功，密码已重置为 123456"