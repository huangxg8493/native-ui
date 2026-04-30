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
