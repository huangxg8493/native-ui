# 用户管理页面字段补全设计

## 背景

根据用户列表接口 `/api/users/query` 的响应数据，`html/sys/user.html` 页面表格和新增/编辑弹窗缺少部分字段需要补全。

## 接口字段一览

| 字段 | 类型 | 说明 |
|------|------|------|
| userId | Long | 用户ID |
| phone | String | 手机号 |
| status | String | 状态 (Y=正常, N=禁用) |
| userName | String | 用户名 |
| email | String | 邮箱 |
| province | String | 省份（表格不单独展示） |
| city | String | 城市（作为"省市区"字段的值） |
| district | String | 区县（不使用） |
| hobby | String | 爱好（不使用） |
| createTime | LocalDateTime | 创建时间 |
| updateTime | LocalDateTime | 更新时间 |

## 改动范围

### 1. 表格（user.html）

**表头**（9列）：

| 序号 | 手机号 | 用户名 | 邮箱 | 省市区 | 状态 | 创建时间 | 更新时间 | 操作 |
|------|--------|--------|------|--------|------|----------|----------|------|

- 省市区字段取接口返回的 `city` 字段值（例：`杭州`），province/district 不单独展示
- 更新时间为只读展示，格式与创建时间一致：`YYYY-MM-DD HH:mm`
- colspan 从 8 改为 9

**空数据提示**：colspan 改为 9

### 2. JS 数据渲染（assets/script/user.js）

`renderTable()` 函数改动：
- 省市列：改为取 `user.city` 字段显示（不再拼接 province/city）
- 新增更新时间列：调用 `formatTime(user.updateTime)`
- 翻页信息 colspan 8 → 9

### 3. 新增/编辑弹窗（user.html）

**表单字段**（8个）：

| 字段 | 控件类型 | 说明 |
|------|----------|------|
| 手机号 | input text | 必填，11位手机号 |
| 密码 | input password | 新增时必填（最少6位），编辑时选填（不填则不修改） |
| 用户名 | input text | - |
| 邮箱 | input text | - |
| 省市区 | input text | 取 city 字段，placeholder 示例：`杭州` |
| 状态 | select | Y=正常，N=禁用 |
| 创建时间 | text（只读） | 格式 `YYYY-MM-DD HH:mm`，新增时显示 `-`，编辑时显示实际值 |
| 更新时间 | text（只读） | 格式 `YYYY-MM-DD HH:mm`，新增时显示 `-`，编辑时显示实际值 |

编辑时需回填用户名、邮箱、省市区（city）、状态、创建时间、更新时间。

## 确认事项

- district、hobby 字段本轮不使用
- province 字段本轮不单独展示，省市区的值取自 city
