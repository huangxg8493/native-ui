# register.html 接口字段调整设计方案

## 背景

用户注册接口 `/api/auth/register` 字段更新，需要同步调整 `html/login/register.html` 表单结构。

## 接口字段变更

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | String | 是 | 手机号，11位，1开头 |
| password | String | 是 | 密码，最少6位 |
| userName | String | 否 | 用户名 |
| email | String | 否 | 邮箱 |
| city | String | 否 | 城市 |
| addrDetail | String | 否 | 地址详情 |
| hobby | String | 否 | 爱好 |

### 移除字段
- province（省份）
- district（区县）

### 新增字段
- addrDetail（地址详情）

## 设计方案

### 表单结构调整

**移除：**
- 省份输入框（province）
- 区县输入框（district）

**新增：**
- 地址详情输入框（addrDetail）

**保留：**
- 手机号（phone）
- 用户名称（userName）
- 邮箱（email）
- 城市（city）
- 爱好（hobby）
- 密码（password）
- 确认密码（confirmPassword）

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

## 修改范围

- `html/login/register.html` — 表单 HTML 结构调整

## 状态

- [x] 设计方案已批准
- [ ] 实现
