# 首页实施计划

## 目标

在 main.html 中实现首页 Tab，左侧 30% 展示用户信息/日历/公告，右侧 70% 展示待办事项 CRUD

## 架构

首页作为 TabManager 中的一个 Tab，渲染到 `#tabContent` 区域。模块独立加载，复用现有 `loadModule` 约定路径机制。

## 技术栈

原生 JS (IIFE)，localStorage 存储，TabManager 动态渲染

---

## 文件映射

| 文件 | 操作 |
|------|------|
| `assets/css/home.css` | 新建：首页样式 |
| `assets/script/tab-manager.js` | 修改：增加不可关闭 Tab 支持 |
| `assets/script/home.js` | 新建：首页模块 |
| `html/main.html` | 修改：注册首页 Tab |

---

## 任务清单

### Task 1: 创建首页样式

**涉及文件:**
- 新建: `assets/css/home.css`

**步骤:**
- [ ] Step 1: 创建 home.css（简洁商务风格样式）
- [ ] Step 2: git add assets/css/home.css && git commit -m "feat(home): 创建首页样式文件"

### Task 2: 修改 TabManager 支持不可关闭 Tab

**涉及文件:**
- 修改: `assets/script/tab-manager.js`（register 和 render 方法）

**步骤:**
- [ ] Step 1: 修改 register 方法，增加 closable 参数（默认 true）
- [ ] Step 2: 修改 render 方法，closable 为 false 时不显示关闭按钮
- [ ] Step 3: git add assets/script/tab-manager.js && git commit -m "feat(tab-manager): 支持不可关闭 Tab"

### Task 3: 创建首页模块

**涉及文件:**
- 新建: `assets/script/home.js`

**步骤:**
- [ ] Step 1: 创建 home.js（用户信息、日历、公告、代办 CRUD）
- [ ] Step 2: git add assets/script/home.js && git commit -m "feat(home): 创建首页模块"

### Task 4: 修改 main.html 注册首页 Tab

**涉及文件:**
- 修改: `html/main.html`

**步骤:**
- [ ] Step 1: 添加 home.js 引用
- [ ] Step 2: 注册首页 Tab（不可关闭），默认打开
- [ ] Step 3: git add html/main.html && git commit -m "feat(home): 注册首页 Tab，默认打开"

---

## 验证步骤

1. 登录后跳转到 main.html
2. Tab 栏左侧显示"首页" Tab，无关闭按钮
3. 左侧显示用户信息（姓名、头像、手机号）、日历（今日高亮）、公告列表
4. 右侧显示待办事项列表，可新增/编辑/删除/标记完成
5. 刷新页面后代办数据保留（localStorage）