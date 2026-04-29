# 发现项

## 项目背景
- 前端项目，使用原生 HTML/CSS/JavaScript
- Ant Design 风格 UI，主色 #1890ff
- IIFE 模式避免全局污染
- 目前仅有 html/client/address.html 和 address.css

## 设计决策
- **布局方案**: 简洁居中卡片式（白色卡片垂直居中）
- **登录字段**: 手机号 + 密码 + 记住登录状态
- **状态存储**: localStorage 存储 token 和 phone
- **入口检查**: index.html 加载时检查 token 决定跳转

## 技术要点
- 使用 fetch 调用 /api/auth/login 接口
- 登录成功存储 token 到 localStorage
- 记住登录状态时保存 phone，回填表单
- 退出登录清除 localStorage 并跳转 login.html

## 新增设计决策
- **登录引导**: 登录失败时显示"还没有账号？去注册"链接
- **注册页面**: 新增 register.html，包含手机号、密码、确认密码表单
- **注册接口**: 调用 POST /api/auth/register 接口
- **注册验证**: 前端验证密码与确认密码一致性
- **注册成功**: 提示"注册成功，请登录"并跳转 login.html

## 登录认证信息存储设计决策
- **存储方案**: 分散存储，token、phone、user、roles、menus 分别存储
- **存储方式**: user、roles、menus 使用 JSON.stringify 存储
- **"记住登录"行为**: 仅记住 phone 字段，user/roles/menus 每次登录重新存储
- **更新文件**: login.html（存储）、main.html（清除）
- **其他页面读取**: `JSON.parse(localStorage.getItem('user'))`

## 主页菜单系统设计决策
- **菜单布局**: 顶部水平菜单，一级菜单横向排列
- **菜单数据来源**: localStorage.getItem('menus')
- **一级菜单**: 仅显示 menuType=CATALOG 类型
- **子菜单**: 显示 isLeaf=Y 且 menuType=MENU 类型
- **展开方式**: hover 延迟 150ms 展开，200ms 收起
- **图标方案**: 内联 SVG 图标

## 图标库设计决策
- **数据来源**: Ant Design Icons (~780个) + Element Plus Icons (~200个)
- **输出格式**: SVG Sprite（`<symbol>` 标签）
- **图标 ID 格式**: `ant-{name}`（Ant Design）、`el-{name}`（Element Plus）
- **viewBox**: 统一为 `0 0 1024 1024`
- **颜色控制**: 通过 `currentColor` 或 CSS fill 控制
- **输出文件**:
  - `assets/icons/ant-design-icons.svg`
  - `assets/icons/element-plus-icons.svg`
  - `assets/icons/icons.css`
  - `assets/icons/index.html`（预览页面）
- **使用方式**: `<svg><use href="#ant-user"></use></svg>`
- **重要约束**: 只收集图标，不改任何现有代码

## 菜单图标库集成设计决策
- **目标**: 将 main.html 菜单图标改为使用 assets/icons 图标库
- **实现方式**: 动态加载 SVG Sprite，修改 getIconSvg 函数
- **图标 ID 来源**: 数据库菜单项的 icon 字段
- **ID 格式**: `ant-{name}` 或 `el-{name}`
- **原有代码处理**: 注释保留，不删除
- **加载时机**: 页面加载时先加载图标库，再渲染菜单

## 扩展图标库设计决策
- **新增图标库**: Lucide、Heroicons、Phosphor、Tabler、Font Awesome、Material Icons
- **ID 前缀**:
  - Lucide: `lucide-`
  - Heroicons: `hero-`
  - Phosphor: `ph-`
  - Tabler: `tabler-`
  - Font Awesome: `fa-`
  - Material: `mat-`
- **输出文件**:
  - `assets/icons/lucide-icons.svg`
  - `assets/icons/heroicons.svg`
  - `assets/icons/phosphor-icons.svg`
  - `assets/icons/tabler-icons.svg`
  - `assets/icons/fontawesome-icons.svg`
  - `assets/icons/material-icons.svg`
- **约束**: 只收集图标，不改现有代码，main.html 暂不更新

## Tab 式 SPA 多页面架构设计决策
- **核心**: TabManager 作为 SPA 核心，管理 Tab 的打开/关闭/切换
- **Tab 数据结构**: { id, title, renderFn }，id 由菜单 URL 转换得到（如 `/system/user` → `system-user`）
- **Tab 渲染**: 点击菜单时注册 Tab 并打开，已存在则激活而非重建
- **内容区**: main.html 中 `<main class="main-content">` 下新增 `<div id="tabBar">` 和 `<div id="tabContent">`
- **欢迎页**: 关闭所有 Tab 后显示默认欢迎页（content-card）
- **模块动态加载**: loadModule 函数根据 moduleId 动态加载 CSS 和 JS

## 用户管理页面设计决策
- **页面文件**: `html/client/user.html`（HTML结构）、`assets/css/user.css`（样式）、`assets/script/user.js`（逻辑）
- **模块接口**: IIFE 模式，暴露 `UserModule.init(container)` / `refresh()` / `destroy()`
- **弹窗设计**: 新增/编辑共用一个表单弹窗，分配角色为独立复选框弹窗
- **状态标签**: status=Y 显示绿色"正常"，status=N 显示红色"禁用"
- **角色列表来源**: 从 localStorage.roles 获取当前用户角色
- **分页**: 每页 5/10/20/50 条，默认 10

## 用户管理页面 HTML 片段化改造设计决策
- **背景**: 当前 user.html 未被使用，实际使用 user.js 中的内嵌 HTML_TEMPLATE
- **目标**: 改为物理分离，user.html 作为 HTML 片段通过 fetch 加载
- **loadModule 扩展**: 支持 `type: 'html'` 配置，使用 fetch 加载 HTML 片段
- **moduleMap 配置**: `{ 'user': { type: 'html', html: '../html/sys/user.html' } }`
- **路径设计**:
  - main.html 加载 user.html: `../html/sys/user.html`
  - user.html 加载 CSS: `../../assets/css/user.css`
  - user.html 加载 JS: `../../assets/script/user.js`
- **globalVarName**: `user` → `UserModule`
- **执行顺序**: user.html → user.js → main.html

## 用户管理页面风格美化设计决策
- **目标**: user.html 风格与 address.html 保持一致
- **方案**: user.css 完全独立，不引用 address.css，样式手动与 address.css 对齐
- **涉及文件**: 只修改 `assets/css/user.css`
- **样式对齐**: 容器、搜索栏、表格、弹窗、按钮、分页等所有通用样式
- **专用样式**: .editBtn、.deleteBtn、.roleBtn、.role-item、#roleList 等 user 页面专用样式保留

