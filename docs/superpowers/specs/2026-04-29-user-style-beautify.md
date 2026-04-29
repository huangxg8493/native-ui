# 用户管理页面风格美化 - 设计文档

**日期:** 2026-04-29
**方案:** 方案 B - user.html 独立样式
**状态:** 设计完成，等待实施

---

## 一、背景

当前 `html/sys/user.html` 与 `html/client/address.html` 页面风格存在差异。需要将 user.html 的风格与 address.html 保持一致。

**方案 B 核心**：
- user.css **完全独立**，不引入 address.css
- user.css 的样式需要手动与 address.css 对齐
- user.html 只引入 user.css

---

## 二、整体架构

```
user.html
  └── <link href="user.css">    ← 完全独立的样式文件
  └── <script src="user.js">    ← 逻辑

user.css                          ← 独立样式（需与 address.css 对齐）
  └── 容器、搜索栏、表格、弹窗、按钮等所有样式

address.css                       ← 仅供参考对比，不引入
```

---

## 三、涉及修改的文件

| 文件 | 修改内容 |
|------|----------|
| `assets/css/user.css` | 完全独立重写，样式与 address.css 对齐 |
| `html/sys/user.html` | 无需修改 |
| `assets/css/address.css` | 无需修改（仅供参考） |

---

## 四、详细设计

### 4.1 user.html 修改

user.html 无需修改，保持现有的 HTML 片段结构。

样式引入保持不变：
```html
<link rel="stylesheet" href="../../assets/css/user.css">
<script src="../../assets/script/user.js"></script>
```

### 4.2 user.css 修改

**核心原则**：user.css 样式需要与 address.css 完全对齐，不引用 address.css。

**样式对比**：

| 样式元素 | address.css | user.css（需对齐） |
|----------|-------------|-------------------|
| body | `font-family: "Microsoft YaHei", Arial, sans-serif; background: #f5f5f5` | 需一致 |
| .container | `max-width: 1200px; margin: 20px auto; padding: 20px; background: white; border-radius: 8px; box-shadow` | 需一致 |
| .search-bar | `margin-bottom: 20px` | 需一致 |
| .search-bar-row | `display: flex; align-items: center; margin-bottom: 10px` | 需一致 |
| .search-bar input | `padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 4px; width: 200px` | 需一致 |
| .search-bar select | `padding: 8px 12px; border: 1px solid #d9d9d9; border-radius: 4px; width: auto` | 需一致 |
| #queryBtn | `background-color: #1890ff; color: white; margin-left: 10px` | 需一致 |
| #addBtn | `background-color: #52c41a; color: white` | 需一致 |
| table | `width: 100%; border-collapse: collapse; margin-bottom: 20px` | 需一致 |
| th | `border: 1px solid #ddd; padding: 12px; background: #fafafa; font-weight: 600` | 需一致 |
| .modal | `display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); justify-content: center; align-items: center` | 需一致 |
| .modal-content | `background: white; padding: 30px; border-radius: 8px; width: 400px` | 需一致 |
| .form-row | `display: flex; align-items: flex-start; margin-bottom: 15px` | 需一致 |
| .form-row label | `width: 80px; line-height: 32px; font-weight: 500` | 需一致 |
| .form-actions button | `padding: 8px 20px; margin-left: 10px; border: none; border-radius: 4px` | 需一致 |
| #cancelBtn | `background-color: #999; color: white` | 需一致 |
| .form-actions button[type="submit"] | `background-color: #1890ff; color: white` | 需一致 |
| .toast | `position: fixed; top: 20px; left: 50%; transform: translateX(-50%); padding: 12px 24px; border-radius: 4px; color: #fff; font-size: 14px; z-index: 10000` | 需一致 |

**user 页面专用样式**（address.css 中没有的）：

```css
.editBtn, .deleteBtn, .roleBtn {
    padding: 4px 8px;
    margin-right: 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.editBtn, .roleBtn {
    background-color: #1890ff;
    color: white;
}

.deleteBtn {
    background-color: #ff4d4f;
    color: white;
}

.role-item {
    display: flex;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
}

#roleList {
    margin: 15px 0;
    max-height: 300px;
    overflow-y: auto;
}
```

---

## 五、样式文件对比清单

user.css 需要参考 address.css 的样式重新编写，确保：

1. **通用样式**：与 address.css 完全一致
2. **专用样式**：保留 user 页面特有的样式（.editBtn、.deleteBtn、.roleBtn、.role-item、#roleList）

---

## 六、测试验证

1. 在浏览器中打开 main.html
2. 点击"用户管理"菜单
3. 检查页面样式是否与 address.html 一致：
   - 容器样式（白色卡片、圆角、阴影）
   - 搜索栏样式（横向排列、间距）
   - 表格样式（表头背景、边框）
   - 分页样式（位置、对齐）
   - 弹窗样式（居中、宽度、圆角）
   - 按钮样式（查询蓝、新增绿、编辑蓝、删除红）
4. 检查角色分配弹窗样式

---

## 七、注意事项

1. user.css 不引用 address.css，完全独立
2. user.css 需要覆盖所有通用样式（容器、搜索栏、表格、弹窗等）
3. user.css 需要保留 user 页面专用样式