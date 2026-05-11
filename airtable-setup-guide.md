# Airtable 设置指南

## 步骤 1: 创建Airtable账号和Base

1. 访问 <https://airtable.com> 并注册账号
2. 点击 "Create a base" 或 "Add a base"
3. 选择 "Start from scratch"
4. 命名Base为：**BizBroker**

## 步骤 2: 创建 Listings 表

创建第一张表，命名为 **Listings**，添加以下字段：

| 字段名               | 字段类型         | 说明                                          |
| -------------------- | ---------------- | --------------------------------------------- |
| Business Name        | Single line text | 业务名称                                      |
| Industry             | Single line text | 行业                                          |
| Description          | Long text        | 描述                                          |
| Location             | Single line text | 新加坡地区                                    |
| Years in Operation   | Number           | 运营年限                                      |
| Annual Revenue (SGD) | Currency         | 年营收，格式选择SGD                           |
| Net Profit (SGD)     | Currency         | 净利润，格式选择SGD                           |
| Asking Price (SGD)   | Currency         | 要价，格式选择SGD                             |
| Employees            | Number           | 员工数                                        |
| Reason for Selling   | Long text        | 出售原因                                      |
| Key Assets           | Long text        | 关键资产                                      |
| Status               | Single select    | 选项：Pending Review, Active, Sold, Withdrawn |
| Seller Name          | Single line text | 卖家姓名                                      |
| Seller Email         | Email            | 卖家邮箱                                      |
| Seller Phone         | Phone            | 卖家电话                                      |
| AI Summary           | Long text        | AI生成摘要                                    |
| Valuation Low        | Currency         | 估值低位，格式选择SGD                         |
| Valuation Mid        | Currency         | 估值中位，格式选择SGD                         |
| Valuation High       | Currency         | 估值高位，格式选择SGD                         |
| Created              | Created time     | 自动生成                                      |

## 步骤 3: 创建 Leads 表

点击 "+" 添加新表，命名为 **Leads**，添加以下字段：

| 字段名                  | 字段类型         | 说明                                                  |
| ----------------------- | ---------------- | ----------------------------------------------------- |
| Name                    | Single line text | 买家姓名                                              |
| Email                   | Email            | 邮箱                                                  |
| Phone                   | Phone            | 电话                                                  |
| Budget (SGD)            | Currency         | 预算，格式选择SGD                                     |
| Funding Source          | Single line text | 资金来源                                              |
| Preferred Industries    | Long text        | 偏好行业                                              |
| Preferred Location      | Single line text | 偏好地区                                              |
| Timeline                | Single line text | 收购时间线                                            |
| Has Business Experience | Checkbox         | 有无从商经验                                          |
| ROI Expectation (%)     | Number           | 期望回报率                                            |
| Lead Score              | Number           | 综合评分 0-100                                        |
| Tier                    | Single select    | 选项：🔥 Hot, 🌡️ Warm, ❄️ Cold                        |
| Status                  | Single select    | 选项：New, Contacted, Qualified, Nurturing, Converted |
| Score Breakdown         | Long text        | 评分明细（JSON）                                      |
| Chat Summary            | Long text        | 对话摘要                                              |
| Created                 | Created time     | 自动生成                                              |

## 步骤 4: 获取API密钥

1. 点击右上角的头像
2. 选择 "Developer Hub" 或直接访问 <https://airtable.com/create/tokens>
3. 点击 "Create new token"
4. 命名为：**BizBroker API**
5. 添加权限范围（Scopes）:
   - ✅ `data.records:read`
   - ✅ `data.records:write`
6. 添加访问权限（Access）:
   - 选择你创建的 **BizBroker** Base
7. 点击 "Create token"
8. **复制token** (格式：`pat...`)，保存好，只显示一次！

## 步骤 5: 获取Base ID

方法1 - 从URL获取：

1. 打开你的BizBroker Base
2. 在浏览器地址栏查看URL：`https://airtable.com/appXXXXXXXXXXXXXX/...`
3. 复制 `app` 开头的那串ID

方法2 - 从API文档获取：

1. 访问 <https://airtable.com/developers/web/api/introduction>
2. 选择你的 BizBroker Base
3. 在API文档URL中可以看到Base ID

## 完成

现在你有了：

- ✅ AIRTABLE_API_KEY: `patXXXXXXXXXXXXXX`
- ✅ AIRTABLE_BASE_ID: `appXXXXXXXXXXXXXX`

将这两个值填入 `.env.local` 文件中。
