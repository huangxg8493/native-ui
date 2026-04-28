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
