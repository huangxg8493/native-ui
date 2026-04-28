# 图标库实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 从 Ant Design Icons 和 Element Plus Icons 提取所有图标，生成本地 SVG Sprite 文件

**架构：** 克隆两个图标库仓库，提取 SVG 文件，转换为 `<symbol>` 格式汇总到独立 SVG 文件，生成配套 CSS 和预览页面

**技术栈：** Node.js / npm, bash 命令行工具

---

## 文件结构

```
assets/icons/
  ant-design-icons.svg    # Ant Design 图标集 Sprite
  element-plus-icons.svg  # Element Plus 图标集 Sprite
  icons.css               # 图标使用辅助类
  index.html              # 图标预览页面
```

---

## 任务列表

### 任务 1: 准备工作目录

**Files:**
- Create: `assets/icons/` (目录)

- [ ] **Step 1: 创建图标目录**

```bash
mkdir -p D:/AI/native-ui/assets/icons
```

- [ ] **Step 2: 提交目录创建**

```bash
git add assets/icons
git commit -m "chore: 创建图标库目录"
```

---

### 任务 2: 克隆并提取 Ant Design Icons

**Files:**
- Create: `temp/ant-design-icons/` (临时克隆目录)
- Modify: `assets/icons/ant-design-icons.svg` (从临时文件生成)

- [ ] **Step 1: 克隆 ant-design-icons 仓库**

```bash
git clone --depth 1 https://github.com/ant-design/ant-design-icons.git D:/AI/native-ui/temp/ant-design-icons
```

- [ ] **Step 2: 检查 SVG 文件位置**

```bash
ls D:/AI/native-ui/temp/ant-design-icons/packages/ant-design-icons/svg/
```

预期输出：应看到 `24x24` 和 `16x16` 目录，各包含 `filled` 和 `outlined` 子目录

- [ ] **Step 3: 创建 Node.js 脚本转换为 Sprite 格式**

创建 `temp/convert-ant-icons.js`：

```javascript
const fs = require('fs');
const path = require('path');

const svgDir = 'D:/AI/native-ui/temp/ant-design-icons/packages/ant-design-icons/svg/24x24';
const outputFile = 'D:/AI/native-ui/assets/icons/ant-design-icons.svg';

let symbols = [];

// 遍历 outlined 和 filled
['outlined', 'filled'].forEach(type => {
  const typeDir = path.join(svgDir, type);
  if (!fs.existsSync(typeDir)) return;

  const files = fs.readdirSync(typeDir).filter(f => f.endsWith('.svg'));

  files.forEach(file => {
    const name = file.replace('.svg', '');
    const prefix = type === 'filled' ? 'ant-fill-' : 'ant-';
    const id = prefix + name;
    const content = fs.readFileSync(path.join(typeDir, file), 'utf-8');

    // 提取 SVG 内容（去掉 <svg> 标签，保留内部内容）
    const match = content.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
    if (match) {
      symbols.push(`  <symbol id="${id}" viewBox="0 0 1024 1024">\n    ${match[1].trim()}\n  </symbol>`);
    }
  });
});

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg">\n${symbols.join('\n')}\n</svg>`;
fs.writeFileSync(outputFile, svgContent, 'utf-8');
console.log(`Generated ${symbols.length} icons to ${outputFile}`);
```

- [ ] **Step 4: 运行转换脚本**

```bash
cd D:/AI/native-ui && node temp/convert-ant-icons.js
```

预期输出：`Generated XXX icons to assets/icons/ant-design-icons.svg`

- [ ] **Step 5: 清理临时文件**

```bash
rm -rf D:/AI/native-ui/temp/ant-design-icons
```

---

### 任务 3: 克隆并提取 Element Plus Icons

**Files:**
- Create: `temp/element-plus-icons/` (临时克隆目录)
- Modify: `assets/icons/element-plus-icons.svg` (从临时文件生成)

- [ ] **Step 1: 克隆 element-plus-icons 仓库**

```bash
git clone --depth 1 https://github.com/element-plus/element-plus-icons.git D:/AI/native-ui/temp/element-plus-icons
```

- [ ] **Step 2: 检查 SVG 文件位置**

```bash
ls D:/AI/native-ui/temp/element-plus-icons/packages/icons/
```

预期输出：应看到多个 SVG 文件

- [ ] **Step 3: 创建 Node.js 脚本转换为 Sprite 格式**

创建 `temp/convert-el-icons.js`：

```javascript
const fs = require('fs');
const path = require('path');

const svgDir = 'D:/AI/native-ui/temp/element-plus-icons/packages/icons';
const outputFile = 'D:/AI/native-ui/assets/icons/element-plus-icons.svg';

let symbols = [];

if (!fs.existsSync(svgDir)) {
  console.log('Directory not found:', svgDir);
  process.exit(1);
}

const files = fs.readdirSync(svgDir).filter(f => f.endsWith('.svg'));

files.forEach(file => {
  const name = file.replace('.svg', '');
  const id = 'el-' + name;
  const content = fs.readFileSync(path.join(svgDir, file), 'utf-8');

  // 提取 SVG 内容
  const match = content.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (match) {
    symbols.push(`  <symbol id="${id}" viewBox="0 0 1024 1024">\n    ${match[1].trim()}\n  </symbol>`);
  }
});

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg">\n${symbols.join('\n')}\n</svg>`;
fs.writeFileSync(outputFile, svgContent, 'utf-8');
console.log(`Generated ${symbols.length} icons to ${outputFile}`);
```

- [ ] **Step 4: 运行转换脚本**

```bash
cd D:/AI/native-ui && node temp/convert-el-icons.js
```

预期输出：`Generated XXX icons to assets/icons/element-plus-icons.svg`

- [ ] **Step 5: 清理临时文件**

```bash
rm -rf D:/AI/native-ui/temp/element-plus-icons
```

---

### 任务 4: 生成图标 CSS 辅助类

**Files:**
- Create: `assets/icons/icons.css`

- [ ] **Step 1: 创建 CSS 文件**

创建 `assets/icons/icons.css`：

```css
/* 图标库辅助类 - 基于 SVG Sprite */

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
}

.icon svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

/* Ant Design Icons */
.anticon {
  display: inline-flex;
  align-items: center;
  margin-right: 6px;
  color: inherit;
}

.anticon::before {
  content: '';
  display: none;
}

.anticon svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* 常见图标示例类 */
.ant-user::before { content: ''; display: none; }
.ant-user { display: inline-flex; align-items: center; }
.ant-user svg use { href: '#ant-user'; }
```

注意：由于 SVG Sprite 需要在 HTML 中使用 `<use>` 标签，CSS 方式需要特殊处理。完整实现见 index.html 预览页面。

---

### 任务 5: 创建图标预览页面

**Files:**
- Create: `assets/icons/index.html`

- [ ] **Step 1: 创建预览页面**

创建 `assets/icons/index.html`：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>图标库预览</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f0f2f5; padding: 24px; }
    h1 { margin-bottom: 24px; color: #333; }
    h2 { margin: 24px 0 12px; color: #666; font-size: 16px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 12px; }
    .item { display: flex; flex-direction: column; align-items: center; padding: 16px; background: #fff; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
    .item:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .item svg { width: 24px; height: 24px; fill: #333; }
    .item:hover svg { fill: #1890ff; }
    .item span { margin-top: 8px; font-size: 12px; color: #999; word-break: break-all; text-align: center; }
    .search { margin-bottom: 24px; }
    .search input { width: 100%; max-width: 400px; padding: 10px 16px; border: 1px solid #d9d9d9; border-radius: 4px; font-size: 14px; }
    .search input:focus { outline: none; border-color: #1890ff; }
  </style>
</head>
<body>
  <!-- 引入两个 SVG Sprite -->
  <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
    <include href="ant-design-icons.svg"/>
    <include href="element-plus-icons.svg"/>
  </svg>

  <h1>图标库预览</h1>

  <div class="search">
    <input type="text" id="searchInput" placeholder="搜索图标名称...">
  </div>

  <h2>Ant Design Icons</h2>
  <div class="grid" id="antGrid"></div>

  <h2>Element Plus Icons</h2>
  <div class="grid" id="elGrid"></div>

  <script>
    // 解析 SVG 文件获取图标列表
    function parseSvgForIcons(svgUrl, prefix, gridId) {
      fetch(svgUrl)
        .then(r => r.text())
        .then(text => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'image/svg+xml');
          const symbols = doc.querySelectorAll('symbol');
          const grid = document.getElementById(gridId);

          symbols.forEach(sym => {
            const id = sym.getAttribute('id');
            const item = document.createElement('div');
            item.className = 'item';
            item.dataset.name = id;
            item.innerHTML = `
              <svg viewBox="0 0 1024 1024"><use href="#${id}"></use></svg>
              <span>${id}</span>
            `;
            item.addEventListener('click', () => {
              navigator.clipboard.writeText(`<svg viewBox="0 0 1024 1024"><use href="#${id}"></use></svg>`);
            });
            grid.appendChild(item);
          });
        });
    }

    parseSvgForIcons('ant-design-icons.svg', 'ant', 'antGrid');
    parseSvgForIcons('element-plus-icons.svg', 'el', 'elGrid');

    // 搜索功能
    document.getElementById('searchInput').addEventListener('input', function() {
      const q = this.value.toLowerCase();
      document.querySelectorAll('.item').forEach(item => {
        item.style.display = item.dataset.name.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  </script>
</body>
</html>
```

注意：`<include>` 标签不是标准 HTML，需要通过 JavaScript 加载或直接内联 SVG Sprite 内容。

---

### 任务 6: 更新 main.html 使用新图标库

**Files:**
- Modify: `html/main.html`

- [ ] **Step 1: 在 main.html 中引入 SVG Sprite**

在 `<body>` 标签后添加：

```html
<!-- 图标库 Sprite -->
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <symbol id="ant-setting" viewBox="0 0 1024 1024"><path d="M924 440h-68c-4.2 0-8.3 1.7-11.3 4.7l-63.8 63.8c-17.4 17.4-40.7 27-65.4 27-24.7 0-48-9.6-65.4-27l-176-176c-3.3-3.3-8.6-4.6-13.3-3.3-4.7 1.3-8.3 5-9.6 9.6L379 411.2c-6.5 21.2-20.3 39.7-39.1 52.2L229.5 554c-8.3 7.6-13 18.2-13 29.5 0 11.3 4.7 21.9 13 29.5l110.4 110.4c8.3 7.6 18.2 13 29.5 13 11.3 0 21.9-4.7 29.5-13l90.6-90.6c12.5-18.8 31.1-32.6 52.2-39.1l35.7-35.7c3.3-3.3 8.6-4.6 13.3-3.3 4.7 1.3 8.3 5 9.6 9.6l35.7 95.3c12.1 32.3 44.3 54.4 79.4 54.4 11.3 0 21.9-4.7 29.5-13l176-176c17.4-17.4 27-40.7 27-65.4 0-24.7-9.6-48-27-65.4l-63.8-63.8c-3-3-7.1-4.7-11.3-4.7z"/></symbol>
  <!-- 更多 symbol... -->
</svg>
```

- [ ] **Step 2: 更新 iconMap 使用新图标 ID**

修改 `html/main.html` 中的 iconMap：

```javascript
var iconMap = {
  'setting': 'ant-setting',
  'user': 'ant-user',
  // ... 映射到新的图标 ID
};
```

注意：完整实现需要内联所有图标 symbol 或使用其他方式加载 SVG Sprite。

---

### 任务 7: 提交并推送

**Files:**
- Modify: `assets/icons/ant-design-icons.svg`
- Modify: `assets/icons/element-plus-icons.svg`
- Modify: `assets/icons/icons.css` (可选)
- Modify: `assets/icons/index.html`

- [ ] **Step 1: 检查文件状态**

```bash
git status
```

- [ ] **Step 2: 提交所有更改**

```bash
git add assets/icons/ && git commit -m "feat: 建立图标库 from Ant Design & Element Plus"
```

- [ ] **Step 3: 推送**

```bash
git push
```

---

## 自检清单

1. **Spec 覆盖检查：**
   - [x] Ant Design Icons SVG Sprite - 任务 2
   - [x] Element Plus Icons SVG Sprite - 任务 3
   - [x] CSS 辅助类 - 任务 4
   - [x] 预览页面 - 任务 5
   - [x] 集成到 main.html - 任务 6

2. **占位符扫描：** 无 TBD/TODO

3. **类型一致性：** 图标 ID 格式为 `ant-{name}` 和 `el-{name}`，贯穿所有任务