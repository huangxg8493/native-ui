# 全局缩放 80% 设计

## 背景

将所有页面等比例缩小到原来的 80%。

## 范围

### CSS 文件（6 个）
- `assets/css/address.css`
- `assets/css/home.css`
- `assets/css/icons.css`
- `assets/css/login.css`
- `assets/css/user.css`
- `assets/icons/icons.css`

### HTML 内联样式
- `html/main.html`
- `html/home/home.html`
- `html/login/login.html`
- `html/login/register.html`
- `html/client/address.html`
- `html/sys/user.html`

## 缩放规则

- **px 值**：乘以 0.8，四舍五入取整（如 `16px` → `13px`）
- **% 值**：乘以 0.8，四舍五入取整（如 `100%` → `80%`）
- 包含 px 的属性全部适用：`font-size`、`width`、`height`、`padding`、`margin`、`border`、`line-height`、`border-radius` 等

## 实现顺序

1. `assets/css/icons.css` / `assets/icons/icons.css`
2. `assets/css/login.css`
3. `assets/css/address.css`
4. `assets/css/user.css`
5. `assets/css/home.css`
6. HTML 内联样式（`main.html` → 各子页面）
7. 每个文件 commit 一次，便于回退

## 验证

每个文件改完后刷新页面确认布局正常。
