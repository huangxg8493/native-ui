# user.html JS/CSS 统一加载 - 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** user.html 只保留纯 HTML 结构，CSS 和 JS 完全由 loadModule 统一加载

**Architecture:** loadModule HTML 模式手动加载 CSS 和 JS，不依赖 user.html 中的 link/script 标签

**Tech Stack:** 原生 JS、fetch API

---

## 文件结构

| 文件 | 职责 |
|------|------|
| `html/sys/user.html` | 移除 link 和 script 标签，只保留纯 HTML 结构 |
| `html/main.html` | 修改 loadModule HTML 模式，手动加载 CSS 和 JS |

---

## 修改详情

### Task 1: 修改 user.html 移除 link 和 script

**文件:** Modify: `html/sys/user.html`

**步骤:**

- [ ] **Step 1: 移除 link 和 script 标签**

将：
```html
<!-- Toast 容器 -->
<div id="toast" class="toast" style="display:none"></div>

<link rel="stylesheet" href="../../assets/css/user.css">
<script src="../../assets/script/user.js"></script>
```

改为：
```html
<!-- Toast 容器 -->
<div id="toast" class="toast" style="display:none"></div>
```

---

### Task 2: 修改 loadModule HTML 模式手动加载 CSS 和 JS

**文件:** Modify: `html/main.html:551-574`

**步骤:**

- [ ] **Step 1: 替换 HTML 模式加载逻辑**

将当前 HTML 模式代码：
```javascript
if (mod && mod.type === 'html') {
    console.log('[loadModule] HTML模式加载:', mod.html);
    fetch(mod.html)
        .then(function(resp) {
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            return resp.text();
        })
        .then(function(html) {
            console.log('[loadModule] HTML加载成功，长度:', html.length);
            contentEl.innerHTML = html;
            setTimeout(function() {
                console.log('[loadModule] window[globalVarName] 存在:', !!window[globalVarName]);
                if (window[globalVarName]) {
                    window[globalVarName].init(contentEl);
                }
            }, 0);
        })
        .catch(function(err) {
            console.error('[loadModule] HTML加载失败:', err);
        });
    return;
}
```

替换为：
```javascript
if (mod && mod.type === 'html') {
    console.log('[loadModule] HTML模式加载:', mod.html);
    fetch(mod.html)
        .then(function(resp) {
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            return resp.text();
        })
        .then(function(html) {
            console.log('[loadModule] HTML加载成功，长度:', html.length);
            contentEl.innerHTML = html;

            // 手动加载 CSS
            var cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = '../assets/css/' + moduleId + '.css';
            console.log('[loadModule] 加载CSS:', cssLink.href);
            document.head.appendChild(cssLink);

            // 手动加载 JS
            var script = document.createElement('script');
            script.src = '../assets/script/' + moduleId + '.js';
            console.log('[loadModule] 加载JS:', script.src);
            script.onload = function() {
                console.log('[loadModule] JS加载完成, globalVarName:', globalVarName);
                console.log('[loadModule] window[globalVarName] 存在:', !!window[globalVarName]);
                if (window[globalVarName]) {
                    window[globalVarName].init(contentEl);
                }
            };
            script.onerror = function() {
                console.error('[loadModule] JS加载失败:', script.src);
            };
            document.head.appendChild(script);
        })
        .catch(function(err) {
            console.error('[loadModule] HTML加载失败:', err);
        });
    return;
}
```

---

## 自检清单

- [ ] user.html 移除 link 和 script 标签
- [ ] loadModule 手动加载 CSS（通过 document.head.appendChild）
- [ ] loadModule 手动加载 JS（通过 document.head.appendChild）
- [ ] script.onload 中调用 UserModule.init(contentEl)
- [ ] JS 加载完成后调用 init()

---

## 注意事项

1. CSS 和 JS 路径：`'../assets/css/' + moduleId + '.css'` 和 `'../assets/script/' + moduleId + '.js'`
2. 加载顺序：先注入 HTML，再加载 CSS，最后加载 JS
3. init() 在 script.onload 中调用，确保 JS 已解析执行

---

**Plan complete.** 保存于 `docs/superpowers/plans/2026-04-29-user-unified-loading.md`

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**