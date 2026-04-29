# 任务计划

## 项目目标
实现登录页面 login.html、入口页面 index.html 和主页面 main.html

## 文件结构
| 文件 | 说明 |
|------|------|
| `index.html` | 入口页面，检查登录状态并跳转 |
| `login.html` | 登录页面 |
| `main.html` | 登录成功后的主页面（占位） |
| `styles/login.css` | 登录页面样式 |

---

## 任务清单

### Task 1: 创建 index.html 入口页面
- [x] Step 1: 创建 index.html - 检查 localStorage 中是否存在 token 进行跳转
- [x] Step 2: git add index.html && git commit -m "feat: 添加入口页面 index.html"

### Task 2: 创建 styles/login.css 登录样式
- [x] Step 1: 创建 styles/login.css - 包含登录卡片、表单、按钮样式
- [x] Step 2: git add styles/login.css && git commit -m "feat: 添加登录页面样式 login.css"

### Task 3: 创建 login.html 登录页面
- [x] Step 1: 创建 login.html - 表单验证、调用 /api/auth/login、记住登录状态
- [x] Step 2: git add login.html && git commit -m "feat: 添加登录页面 login.html"

### Task 4: 创建 main.html 主页面
- [x] Step 1: 创建 main.html - 登录成功占位页、退出登录功能
- [x] Step 2: git add main.html && git commit -m "feat: 添加主页面 main.html"

---

## 自检清单
- [x] index.html 检查 token 跳转逻辑
- [x] login.html 调用 /api/auth/login 接口
- [x] login.html 记住登录状态功能
- [x] login.html 表单验证（手机号、密码为空提示）
- [x] login.html 错误处理（显示后端错误信息、网络异常提示）
- [x] main.html 退出登录清除 token 并跳转
- [x] 样式使用 Ant Design 主色 #1890ff
- [x] 遵循 IIFE 模式避免全局污染

---

## 新增任务：登录引导注册功能

### Task 1: 修改 login.html 添加注册引导链接
- [x] Step 1: 修改 login.html - 在登录按钮下方添加"还没有账号？去注册"链接
- [x] Step 2: git add login.html && git commit -m "feat: 登录页面添加注册引导链接"

### Task 2: 修改 styles/login.css 添加链接样式
- [x] Step 1: 添加 .register-guide 样式 - 包含链接文字样式和 hover 效果
- [x] Step 2: git add styles/login.css && git commit -m "feat: 添加注册引导链接样式"

### Task 3: 创建 register.html 注册页面
- [x] Step 1: 创建 register.html - 包含手机号、密码、确认密码表单和注册逻辑
- [x] Step 2: git add register.html && git commit -m "feat: 添加注册页面 register.html"

## 新增自检清单
- [x] login.html 添加了"还没有账号？去注册"链接
- [x] styles/login.css 添加了 .register-guide 样式
- [x] register.html 包含手机号、密码、确认密码表单
- [x] register.html 调用 /api/auth/register 接口
- [x] register.html 前端验证密码与确认密码一致性
- [x] register.html 注册成功后跳转 login.html

---

## 新增任务：登录认证信息存储

### Task 1: 更新 login.html 登录成功存储逻辑
- [x] Step 1: 更新 login.html - 登录成功回调存储 user、roles、menus
  - 将原代码：
    ```js
    if (res.code === '000000') {
        // 登录成功
        localStorage.setItem('token', res.data.token);
        if (remember) {
            localStorage.setItem('phone', phone);
        } else {
            localStorage.removeItem('phone');
        }
        window.location.href = '../main.html';
    }
    ```
  - 替换为：
    ```js
    if (res.code === '000000') {
        // 登录成功，存储认证信息
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('phone', res.data.phone);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('roles', JSON.stringify(res.data.roles));
        localStorage.setItem('menus', JSON.stringify(res.data.menus));
        if (!remember) {
            localStorage.removeItem('phone');
        }
        window.location.href = '../main.html';
    }
    ```
- [x] Step 2: git add html/login/login.html && git commit -m "feat: 登录成功存储用户、角色、菜单信息"

### Task 2: 更新 main.html 登出逻辑
- [x] Step 1: 更新 main.html - 登出函数清除全部认证信息
  - 将原代码：
    ```js
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('phone');
        window.location.href = 'login/login.html';
    });
    ```
  - 替换为：
    ```js
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('phone');
        localStorage.removeItem('user');
        localStorage.removeItem('roles');
        localStorage.removeItem('menus');
        window.location.href = 'login/login.html';
    });
    ```
- [x] Step 2: git add html/main.html && git commit -m "feat: 退出登录清除用户、角色、菜单信息"

## 自检清单（登录认证信息存储）
- [x] login.html 登录成功存储 token、phone、user、roles、menus
- [x] main.html 退出登录清除 token、phone、user、roles、menus
- [x] 其他页面可通过 localStorage.getItem('user') 获取用户信息

---

## 新增任务：主页菜单系统

### Task 1: 添加 Ant Design 图标 CDN 和基础布局
- [x] Step 1: 在 head 中添加 Ant Design 图标 CDN
- [x] Step 2: 添加顶部菜单栏 HTML 结构
- [x] Step 3: git add html/main.html && git commit -m "feat: 添加顶部菜单栏基础结构和图标CDN"

### Task 2: 添加顶部菜单 CSS 样式
- [x] Step 1: 在 style 标签中添加菜单相关 CSS
- [x] Step 2: git add html/main.html && git commit -m "style: 添加顶部菜单栏 CSS 样式"

### Task 3: 实现菜单渲染和交互 JS 逻辑
- [x] Step 1: 将原 script 内容替换为完整实现（菜单渲染、hover 交互、点击跳转）
- [x] Step 2: git add html/main.html && git commit -m "feat: 实现顶部菜单渲染和hover交互逻辑"

## 自检清单（主页菜单系统）
- [x] main.html 顶部显示一级菜单（CATALOG 类型）
- [x] hover 150ms 后展开下拉菜单
- [x] 下拉显示子菜单（MENU 类型）
- [x] 点击子菜单跳转到 menuUrl
- [x] 显示菜单图标

---

## 新增任务：图标库建设（只收集图标，不改现有代码）

### Task 1: 准备工作目录
- [x] Step 1: 创建 `assets/icons/` 目录
- [x] Step 2: git add assets/icons && git commit -m "chore: 创建图标库目录"

### Task 2: 克隆并提取 Ant Design Icons
- [x] Step 1: 克隆 ant-design-icons 仓库到 temp 目录
- [x] Step 2: 检查 SVG 文件位置
- [x] Step 3: 创建并运行 Node.js 脚本转换为 Sprite 格式
- [x] Step 4: 运行转换脚本生成 `assets/icons/ant-design-icons.svg`
- [x] Step 5: 清理临时文件

### Task 3: 克隆并提取 Element Plus Icons
- [x] Step 1: 克隆 element-plus-icons 仓库到 temp 目录
- [x] Step 2: 检查 SVG 文件位置
- [x] Step 3: 创建并运行 Node.js 脚本转换为 Sprite 格式
- [x] Step 4: 运行转换脚本生成 `assets/icons/element-plus-icons.svg`
- [x] Step 5: 清理临时文件

### Task 4: 生成图标 CSS 辅助类
- [x] Step 1: 创建 `assets/icons/icons.css` - SVG Sprite 使用辅助类

### Task 5: 创建图标预览页面
- [x] Step 1: 创建 `assets/icons/index.html` - 图标预览和搜索页面

### Task 6: 提交图标库
- [x] Step 1: git add assets/icons/ && git commit -m "feat: 建立图标库 from Ant Design & Element Plus"
- [x] Step 2: git push

---

## 新增任务：菜单图标库集成

### Task 1: 修改 main.html 集成图标库
- [x] Step 1: 添加 SVG Sprite 加载函数 `loadIconSprites`
- [x] Step 2: 注释原 iconMap 对象（保留不删）
- [x] Step 3: 添加新的 getIconSvg 函数（使用图标库 ID）
- [x] Step 4: 注释原 getIconSvg 函数（保留不删）
- [x] Step 5: 在页面加载时调用 loadIconSprites 后再 renderMenu
- [x] Step 6: git add html/main.html && git commit -m "feat: 集成图标库到菜单系统"

---

## 新增任务：扩展图标库（Lucide/Heroicons/Phosphor/Tabler/Font Awesome/Material）

### Task 1: 提取 Lucide Icons
- [x] Step 1: 克隆 lucide-icons/lucide 仓库
- [x] Step 2: 检查 SVG 文件位置
- [x] Step 3: 创建并运行 Node.js 脚本
- [x] Step 4: 生成 `assets/icons/lucide-icons.svg`
- [x] Step 5: 清理临时文件

### Task 2: 提取 Heroicons
- [x] Step 1: 克隆 tailwindlabs/heroicons 仓库
- [x] Step 2: 检查 SVG 文件位置
- [x] Step 3: 创建并运行 Node.js 脚本
- [x] Step 4: 生成 `assets/icons/heroicons.svg`
- [x] Step 5: 清理临时文件

### Task 3: 提取 Phosphor Icons
- [x] Step 1: 克隆 phosphor-icons/phosphor-icons 仓库
- [x] Step 2: 检查 SVG 文件位置
- [x] Step 3: 创建并运行 Node.js 脚本
- [x] Step 4: 生成 `assets/icons/phosphor-icons.svg`
- [x] Step 5: 清理临时文件

### Task 4: 提取 Tabler Icons
- [x] Step 1: 克隆 tabler/tabler-icons 仓库
- [x] Step 2: 检查 SVG 文件位置
- [x] Step 3: 创建并运行 Node.js 脚本
- [x] Step 4: 生成 `assets/icons/tabler-icons.svg`
- [x] Step 5: 清理临时文件

### Task 5: 提取 Font Awesome
- [x] Step 1: 克隆 FortAwesome/Font-Awesome 仓库
- [x] Step 2: 检查 SVG 文件位置
- [x] Step 3: 创建并运行 Node.js 脚本
- [x] Step 4: 生成 `assets/icons/fontawesome-icons.svg`
- [x] Step 5: 清理临时文件

### Task 6: 提取 Material Icons
- [x] Step 1: 克隆 google/material-design-icons 仓库
- [x] Step 2: 检查 SVG 文件位置
- [x] Step 3: 创建并运行 Node.js 脚本
- [x] Step 4: 生成 `assets/icons/material-icons.svg`
- [x] Step 5: 清理临时文件

### Task 7: 更新预览页面
- [x] Step 1: 更新 `assets/icons/index.html` 支持所有图标库分类展示
- [x] Step 2: 提交

### Task 8: 修复并提交
- [x] Step 1: 修复 DOCTYPE 问题（如有）
- [x] Step 2: 提交所有新图标库文件
- [x] Step 3: git push

---

## 新增任务：用户管理页面（Tab 式 SPA + CRUD + 角色分配）

### Task 1: TabManager 核心实现
- [x] Step 1: 创建 `assets/script/tab-manager.js` - 定义 TabManager 全局对象（register/open/close/activate/render/showWelcome）
- [x] Step 2: 修改 `html/main.html` - 引入 tab-manager.js，将菜单点击从 `window.location.href` 改为 `TabManager.open()`，添加 loadModule 动态加载函数

### Task 2: 用户管理页面 HTML 结构
- [x] Step 1: 创建 `html/client/user.html` - 包含搜索栏、数据表格、分页、新增/编辑弹窗、分配角色弹窗的完整 HTML 结构

### Task 3: 用户管理样式
- [x] Step 1: 创建 `assets/css/user.css` - 搜索栏、表格、弹窗、角色列表复选框等样式

### Task 4: 用户管理逻辑
- [x] Step 1: 创建 `assets/script/user.js` - IIFE 模块，暴露 init/refresh/destroy 接口，包含查询/新增/编辑/删除/分配角色的完整逻辑

### Task 5: Tab 栏样式
- [x] Step 1: 在 `html/main.html` 的 `<style>` 中新增 Tab 栏 CSS 样式（.tab-bar/.tab-item/.tab-close 等）
- [x] Step 2: 在 main.html HTML 结构中添加 Tab 栏容器 `<div id="tabBar">` 和内容区 `<div id="tabContent">`
- [x] Step 3: 修改 main.html 中菜单点击逻辑，注册 Tab 并调用 TabManager.open()

### Task 6: 联调与验证
- [x] Step 1: 在浏览器中打开 main.html 验证完整流程

