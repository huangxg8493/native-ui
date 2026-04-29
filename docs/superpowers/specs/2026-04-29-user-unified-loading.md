# user.html JS/CSS 统一加载 - 设计文档

**日期:** 2026-04-29
**状态:** 设计完成，等待实施

---

## 一、问题分析

**根本原因**：通过 `innerHTML` 注入 HTML 时，动态插入的外部 `<script src="">` 标签不会自动执行，而 `<link>` 会正常加载。

**现象**：
- user.css 200 - link 标签正常工作
- user.js 未请求 - script 标签未执行
- UserModule: undefined - JS 未加载，init 未调用

---

## 二、设计目标

user.html 只保留纯 HTML 结构，CSS 和 JS 完全由 loadModule 统一加载。

---

## 三、涉及修改的文件

| 文件 | 修改内容 |
|------|----------|
| `html/sys/user.html` | 移除 link 和 script 标签，只保留纯 HTML 结构 |
| `html/main.html` | 修改 loadModule HTML 模式，手动加载 CSS 和 JS |

---

## 四、loadModule HTML 模式详细设计

### 当前逻辑

```javascript
if (mod && mod.type === 'html') {
    fetch(mod.html)
        .then(resp => resp.text())
        .then(html => {
            contentEl.innerHTML = html;
            // JS 和 CSS 依赖 HTML 中的 link/script 标签（不生效）
        });
}
```

### 修改后的逻辑

```javascript
if (mod && mod.type === 'html') {
    fetch(mod.html)
        .then(resp => resp.text())
        .then(html => {
            contentEl.innerHTML = html;

            // 手动加载 CSS
            var cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = '../assets/css/' + moduleId + '.css';
            document.head.appendChild(cssLink);

            // 手动加载 JS
            var script = document.createElement('script');
            script.src = '../assets/script/' + moduleId + '.js';
            script.onload = function() {
                var globalVarName = moduleId.split('-').map(function(s) {
                    return s.charAt(0).toUpperCase() + s.slice(1);
                }).join('') + 'Module';
                if (window[globalVarName]) {
                    window[globalVarName].init(contentEl);
                }
            };
            script.onerror = function() {
                console.error('[loadModule] JS 加载失败:', script.src);
            };
            document.head.appendChild(script);
        });
    return;
}
```

### 加载顺序

1. fetch user.html
2. contentEl.innerHTML = html
3. 创建 link 加载 CSS（无阻塞）
4. 创建 script 加载 JS
5. script.onload → UserModule.init()

---

## 五、路径设计

| 资源 | 路径 |
|------|------|
| user.html | `../html/sys/user.html` |
| user.css | `../assets/css/user.css` |
| user.js | `../assets/script/user.js` |

---

## 六、user.html 修改

移除 link 和 script 标签：

**修改前：**
```html
<!-- Toast 容器 -->
<div id="toast" class="toast" style="display:none"></div>

<link rel="stylesheet" href="../../assets/css/user.css">
<script src="../../assets/script/user.js"></script>
```

**修改后：**
```html
<!-- Toast 容器 -->
<div id="toast" class="toast" style="display:none"></div>
```

---

## 七、测试验证

1. 点击"用户管理"菜单
2. 检查 Network 中 user.html、user.css、user.js 都被请求
3. 检查页面样式正确
4. 检查查询按钮、新增按钮功能正常
5. 检查 UserModule.init() 被调用（有日志输出）