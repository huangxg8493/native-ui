# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

登录系统前端项目，包含登录/注册、地址管理等功能。根据用户登录状态自动路由到对应页面。

## 技术栈

- 原生 HTML/CSS/JavaScript（无框架）
- Ant Design 风格 UI（主色 #1890ff）
- IIFE 模式避免全局污染

## 文件结构

```
├── index.html          # 首页
├── html/
│   ├── client/
│   │   └── address.html # 地址管理页
│   └── login/
│       ├── login.html   # 登录页
│       └── register.html# 注册页
├── styles/             # 样式文件
│   ├── login.css
│   └── address.css
├── script/             # JavaScript 文件
│   └── address.js
├── http/               # HTTP 请求模块（API 调用封装）
├── docs/               # 文档
└── findings.md / progress.md / task_plan.md  # 规划文件
```

## 常用命令

- 直接在浏览器打开 `index.html` 或 `html/client/address.html` 即可预览
- 无构建步骤，纯静态前端项目

## 代码风格

- IIFE 模式避免全局污染
- 组件化 HTML 片段（html/ 目录下）
- Ant Design 风格 UI（主色 #1890ff）

## Claude Code 命令执行规范 (绝对遵守)
### 禁止使用 cd 复合命令
**绝对禁止**生成类似 `cd <目录> && <命令>` 或 `cd <目录> ; <命令>` 的复合 Bash 命令。
这种格式会触发安全拦截机制，导致流程中断。
### Git 命令规范
- 当前工作目录始终被视为项目根目录，**不需要也不允许**使用 cd 切换目录。
- 直接执行 git 命令，例如：`git add .`、`git commit -m "xxx"`。
- 如果确实需要指定其他目录的 git 仓库，必须使用 git 自带的 `-C` 参数，例如：`git -C D:/other/repo status`。
### 其他命令规范
- 需要在特定目录执行脚本时，不要用 cd，直接传入绝对路径，例如：`node D:/AI/scripts/build.js`。



