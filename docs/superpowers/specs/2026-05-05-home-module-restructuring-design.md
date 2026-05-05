# Home 模块文件重组设计

## 背景

当前 `home` 模块只有 `assets/script/home.js` 和 `assets/css/home.css`，缺少 `home.html`，与其他模块（如 `user`）的文件组织风格不一致。

## 目标

将 `home` 模块重组为 `html/home/home.html` + `home.js` + `home.css`，与 `user` 模块风格保持一致。

## 文件变更

### 1. 新建 `html/home/home.html`

从 `home.js` 的 `render()` 函数中提取 HTML 字符串为真实 HTML 片段。

包含区块：
- `.home-container` > `.home-left` + `.home-right`
- `.home-left`: 用户信息 `.user-info`、日历 `.calendar-block`、公告 `.notice-block`
- `.home-right`: 代办事项 `.todo-block`
- 弹窗 `.modal-overlay#todoModal`

数据占位：`id` 保持不变，初始内容为空或加载中状态。

### 2. 新建 `html/home/home.css`

将 `assets/css/home.css` 整个文件移动到 `html/home/home.css`。

### 3. 改造 `assets/script/home.js`

- `render()` 函数改为初始化已存在的 HTML 元素（数据绑定），不再拼接 HTML 字符串
- 删除 CSS 加载逻辑（`main.html` 的 `loadModule` 统一处理）
- 保留所有数据逻辑：用户信息、日历、代办 CRUD、事件绑定

### 4. 删除 `assets/css/home.css`

已迁移到 `html/home/home.css`。

### 5. 更新 `main.html`

在 `moduleMap` 中添加：
```js
'home': { type: 'html', html: 'html/home/home.html' }
```

让 `home` 模块走 HTML 模式加载，和 `user` 模块一致。

## 实现顺序

1. 创建 `html/home/` 目录
2. 创建 `html/home/home.html`（提取 HTML）
3. 创建 `html/home/home.css`（迁移样式）
4. 改造 `home.js`（改 render 函数）
5. 删除 `assets/css/home.css`
6. 更新 `main.html` 的 `moduleMap`
