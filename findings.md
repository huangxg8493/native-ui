# 发现记录

## register.html 接口字段调整

### 背景
用户注册接口 `/api/auth/register` 字段更新，需要同步调整 `html/login/register.html` 表单结构。

### 当前表单 vs 新接口字段对比

| 当前表单字段 | 新接口字段 | 变化 |
|------------|----------|------|
| phone | phone | 保留 |
| userName | userName | 保留 |
| password | password | 保留 |
| email | email | 保留 |
| province | - | 移除 |
| city | city | 保留 |
| district | - | 移除 |
| hobby | hobby | 保留 |
| - | addrDetail | 新增 |

### 设计决策
- 移除省份（province）、城市（city）、区县（district）三个独立输入框
- 替换为城市（city）+ 地址详情（addrDetail）两个输入框
- 用户确认直接移除旧字段，改为新的地址详情输入框

### 参考文档
- `docs/superpowers/specs/2026-04-30-register-html-update-design.md`
- `docs/superpowers/plans/2026-04-30-register-html-update-plan.md`

---

## user.html 密码重置功能改造

### 背景
将 user.html 中的"修改密码"功能改为"重置密码"功能。管理员可为任意用户重置密码，无需验证旧密码。

### 接口信息
- URL: `POST /api/users/{userId}/password/reset`
- 方法: POST
- 认证: JWT Token
- 请求体: `{ "newPassword": "123456" }`

### 改动点
1. 删除 `#passwordModal`（修改密码弹窗）
2. 按钮文案从"修改密码"改为"重置密码"
3. 点击重置按钮 → confirm 确认 → 调用重置接口
4. 成功后 Toast 提示"重置成功，密码已重置为 123456"

### 参考文档
- `docs/superpowers/specs/2026-04-30-user-password-reset-design.md`
- `docs/superpowers/plans/2026-04-30-user-password-reset-plan.md`