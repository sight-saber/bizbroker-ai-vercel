# Airtable Setup Guide

## 快速开始

### 步骤 1: 创建 Airtable Base

1. 访问 [Airtable](https://airtable.com) 并登录
2. 点击 "Add a base" → "Start from scratch"
3. 命名你的 Base（例如："BizBroker AI"）
4. 记录 Base ID（在 URL 中，格式：`app...`）

### 步骤 2: 获取 API Key

1. 访问 [Airtable Account](https://airtable.com/account)
2. 在 "API" 部分，点击 "Generate API key"
3. 复制 API key
4. 在 `.env.local` 中设置：
   ```
   AIRTABLE_API_KEY=your_api_key_here
   AIRTABLE_BASE_ID=your_base_id_here
   ```

### 步骤 3: 创建表结构

#### 方法 A: 使用自动脚本（推荐）

```bash
# 安装 ts-node（如果还没安装）
npm install -g ts-node

# 运行配置脚本
npx ts-node scripts/setup-airtable.ts
```

脚本会：
- ✅ 验证环境变量
- ✅ 显示完整的表结构配置
- ✅ 测试表是否正确配置
- ✅ 创建和删除测试记录

#### 方法 B: 手动创建（详细步骤）

在你的 Airtable Base 中创建以下表：

---

## Valuations 表配置

### 基本信息字段

| 字段名 | 类型 | 配置 | 说明 |
|--------|------|------|------|
| Business Name | Single line text | - | 企业名称 |
| Contact Email | Email | - | 联系邮箱 |
| Industry | Single select | Options: fnb_retail, services, tech_saas, education, manufacturing, ecommerce, healthcare | 行业类型 |
| Years in Operation | Number | Integer, Precision: 0 | 经营年限 |
| Growth Trend | Single select | Options: growing, stable, declining | 增长趋势 |

### 财务字段

| 字段名 | 类型 | 配置 | 说明 |
|--------|------|------|------|
| Annual Revenue | Currency | Precision: 0, Currency: SGD ($) | 年收入 |
| Net Profit | Currency | Precision: 0, Currency: SGD ($) | 净利润 |
| EBITDA | Currency | Precision: 0, Currency: SGD ($) | EBITDA |
| Asset Value | Currency | Precision: 0, Currency: SGD ($) | 资产价值 |

### 估值结果字段

| 字段名 | 类型 | 配置 | 说明 |
|--------|------|------|------|
| Conservative Valuation | Currency | Precision: 0, Currency: SGD ($) | 保守估值 |
| Fair Market Valuation | Currency | Precision: 0, Currency: SGD ($) | 公允估值 |
| Optimistic Valuation | Currency | Precision: 0, Currency: SGD ($) | 乐观估值 |
| Weighted Average | Currency | Precision: 0, Currency: SGD ($) | 加权平均 |

### 分析字段

| 字段名 | 类型 | 配置 | 说明 |
|--------|------|------|------|
| Customer Concentration | Long text | - | 客户集中度 |
| Risk Factors | Long text | - | 风险因素（分号分隔） |
| Positive Factors | Long text | - | 正面因素（分号分隔） |
| Recommendations | Long text | - | 建议 |
| Methods Used | Long text | - | 使用的方法（JSON格式） |

### 系统字段

| 字段名 | 类型 | 配置 | 说明 |
|--------|------|------|------|
| Calculated At | Date | Include time, GMT+8 | 计算时间 |
| Created | Created time | GMT+8 | 创建时间（自动） |

---

## 创建步骤（手动）

### 1. 在 Airtable 中创建新表

1. 在你的 Base 中，点击左下角的 "+" 添加表
2. 选择 "Create empty table"
3. 命名为 "Valuations"

### 2. 删除默认字段

- 删除自动创建的 "Name", "Notes", "Attachments" 等字段

### 3. 添加字段

按顺序添加上面列出的所有字段：

**对于 Single line text 字段：**
- 点击 "+" → 选择 "Single line text"
- 输入字段名

**对于 Email 字段：**
- 点击 "+" → 选择 "Email"
- 输入字段名

**对于 Currency 字段：**
- 点击 "+" → 选择 "Currency"
- 输入字段名
- 在 "Formatting" 中：
  - Currency: Singapore dollar (SGD)
  - Precision: 0 (no decimals)

**对于 Number 字段：**
- 点击 "+" → 选择 "Number"
- 输入字段名
- Precision: 0 (integer)

**对于 Single select 字段：**
- 点击 "+" → 选择 "Single select"
- 输入字段名
- 添加选项（如 growing, stable, declining）

**对于 Long text 字段：**
- 点击 "+" → 选择 "Long text"
- 输入字段名
- 勾选 "Enable rich text formatting"（可选）

**对于 Date 字段：**
- 点击 "+" → 选择 "Date"
- 输入 "Calculated At"
- 在格式中选择 "Include time"
- 时区设置为 GMT+8 (Singapore)

**对于 Created time 字段：**
- 点击 "+" → 选择 "Created time"
- 命名为 "Created"
- 时区设置为 GMT+8 (Singapore)

### 4. 验证配置

运行验证脚本：

```bash
npx ts-node scripts/setup-airtable.ts
```

如果配置正确，你会看到：
```
✅ Successfully created test record!
✅ Test record cleaned up
🎉 Valuations table is properly configured and working!
```

---

## 现有表的配置

如果你已经有 Listings 和 Leads 表，确保它们也正确配置。

### Listings 表

已存在的字段应包括：
- Business Name
- Industry
- Description
- Location
- Years in Operation
- Annual Revenue (SGD)
- Net Profit (SGD)
- Asking Price (SGD)
- Employees
- Reason for Selling
- Key Assets
- Seller Name
- Seller Email
- Seller Phone
- AI Summary
- **Valuation Low** (Number)
- **Valuation Mid** (Number)
- **Valuation High** (Number)
- Status (Single select: Pending Review, Active, Sold, Withdrawn)
- Created (Created time)

### Leads 表

已存在的字段应包括：
- Name
- Email
- Phone
- Budget (SGD)
- Funding Source
- Preferred Industries
- Preferred Location
- Timeline
- Has Business Experience (Checkbox)
- ROI Expectation (%)
- Lead Score (Number)
- Tier (Single select: 🔥 Hot, 🌡️ Warm, ❄️ Cold)
- Score Breakdown
- Chat Summary
- Status (Single select: New, Contacted, Qualified, Nurturing, Converted)
- Created (Created time)

---

## 测试

配置完成后，测试完整流程：

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 访问 http://localhost:3000

3. 点击 Valuation Agent

4. 完成一次估值对话

5. 点击 "Calculate" 计算估值

6. 点击 "Save" 保存到 Airtable

7. 在 Airtable 中检查是否成功创建记录

8. 点击 "History" 查看历史记录

---

## 故障排查

### 错误: "Table not found"

- 检查表名是否为 "Valuations"（区分大小写）
- 检查 Base ID 是否正确

### 错误: "Field validation error"

- 检查所有字段名是否完全匹配（包括大小写和空格）
- 检查 Currency 字段是否设置为 SGD
- 检查 Single select 字段的选项是否正确

### 错误: "Invalid API key"

- 检查 `.env.local` 中的 `AIRTABLE_API_KEY` 是否正确
- 确保 API key 有访问该 Base 的权限

### 字段类型不匹配

如果保存时出现类型错误，检查：
- Currency 字段必须是 Number 类型
- Single select 的值必须是预定义的选项之一
- Date 字段必须是 ISO 8601 格式

---

## 完成！

配置完成后，你的 Valuation Agent 将能够：
- ✅ 精确计算估值
- ✅ 保存估值记录到 Airtable
- ✅ 查询历史估值
- ✅ 导出 PDF 报告
- ✅ 对比多次估值结果

需要帮助？运行 `npx ts-node scripts/setup-airtable.ts` 查看详细配置信息。
