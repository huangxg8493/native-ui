# 任务计划

## 项目目标
调整 register.html 表单结构，适配新的用户注册接口字段

## 文件结构
| 文件 | 说明 |
|------|------|
| `html/login/register.html` | 注册页面 - 表单结构调整和 JS 逻辑更新 |

---

## 实现计划

### Task 1: 调整 register.html HTML 结构

- [x] Step 1: 移除省份输入框（province）
- [x] Step 2: 移除城市输入框（city）- 后面重新新增
- [x] Step 3: 移除区县输入框（district）
- [x] Step 4: 新增城市输入框（city）
- [x] Step 5: 新增地址详情输入框（addrDetail）
- [x] Step 6: git add html/login/register.html && git commit -m "feat: register.html移除省份区县字段，新增地址详情"

### Task 2: 调整 register.html JS 逻辑

- [x] Step 1: 移除 province/city/district 变量，新增 city/addrDetail 变量
- [x] Step 2: 更新 registerData payload，移除 province/district，新增 city/addrDetail
- [x] Step 3: git commit -m "feat: register.html更新JS逻辑，适配新接口字段"

### Task 3: 验证

- [x] Step 1: 在浏览器中打开 register.html 验证表单结构
- [x] Step 2: 检查 payload 是否正确

---

## 接口字段变更说明

### 移除字段
- province（省份）
- district（区县）

### 新增字段
- addrDetail（地址详情）

### 保留字段
- phone（手机号）
- userName（用户名称）
- email（邮箱）
- city（城市）
- hobby（爱好）
- password（密码）

### 新表单字段顺序
1. 手机号（必填）
2. 用户名称（必填）
3. 邮箱（选填）
4. 城市（选填）
5. 地址详情（选填）
6. 爱好（选填）
7. 密码（必填）
8. 确认密码（必填）

### 提交 Payload
```json
{
    "phone": "13900000001",
    "userName": "张三",
    "email": "zhangsan@example.com",
    "city": "深圳市",
    "addrDetail": "南山区xxx街道xxx号",
    "hobby": "篮球",
    "password": "password123"
}
```
