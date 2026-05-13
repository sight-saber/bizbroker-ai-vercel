# 🚀 Quick Start Guide - Valuation Agent

## 完整设置步骤（5分钟）

### 1️⃣ 安装依赖

```bash
npm install
```

这会安装新增的 `ts-node` 依赖。

---

### 2️⃣ 配置 Airtable

#### A. 创建 Airtable Base

1. 访问 [Airtable](https://airtable.com)
2. 点击 "Add a base" → "Start from scratch"
3. 命名为 "BizBroker AI"

#### B. 获取凭证

1. **API Key**: 访问 [Account Settings](https://airtable.com/account) → Generate API key
2. **Base ID**: 从 Base URL 获取（格式：`appXXXXXXXXXXXXXX`）

#### C. 设置环境变量

在 `.env.local` 文件中添加：

```bash
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
ANTHROPIC_API_KEY=sk-ant-XXXXXXXXXXXXXXXX
```

---

### 3️⃣ 创建 Valuations 表

#### 自动方式（推荐）

```bash
npm run setup:airtable
```

脚本会：
- ✅ 检查环境变量
- ✅ 显示完整的表结构
- ✅ 指导你创建表
- ✅ 验证表配置

#### 手动方式

查看详细步骤：[AIRTABLE_SETUP.md](./AIRTABLE_SETUP.md)

**快速创建清单：**

在 Airtable 中创建 "Valuations" 表，包含以下字段：

| 字段名 | 类型 | 配置 |
|--------|------|------|
| Business Name | Single line text | - |
| Contact Email | Email | - |
| Annual Revenue | Currency | SGD, Precision: 0 |
| Net Profit | Currency | SGD, Precision: 0 |
| EBITDA | Currency | SGD, Precision: 0 |
| Industry | Single select | fnb_retail, services, tech_saas, education, manufacturing, ecommerce, healthcare |
| Years in Operation | Number | Integer |
| Asset Value | Currency | SGD, Precision: 0 |
| Growth Trend | Single select | growing, stable, declining |
| Customer Concentration | Long text | - |
| Risk Factors | Long text | - |
| Positive Factors | Long text | - |
| Conservative Valuation | Currency | SGD, Precision: 0 |
| Fair Market Valuation | Currency | SGD, Precision: 0 |
| Optimistic Valuation | Currency | SGD, Precision: 0 |
| Weighted Average | Currency | SGD, Precision: 0 |
| Recommendations | Long text | - |
| Methods Used | Long text | - |
| Calculated At | Date | Include time |
| Created | Created time | Auto |

---

### 4️⃣ 启动应用

```bash
npm run dev
```

访问 http://localhost:3000

---

## 🎯 功能测试清单

### ✅ 基础功能
- [ ] 访问主页，查看 Valuation Agent 卡片
- [ ] 点击进入 Valuation Agent
- [ ] 开始对话

### ✅ 对话流程
- [ ] Agent 询问年收入
- [ ] Agent 询问净利润
- [ ] Agent 询问行业类型
- [ ] Agent 询问经营年限
- [ ] Agent 询问资产价值
- [ ] Agent 询问增长趋势
- [ ] Agent 询问风险因素

### ✅ 估值计算
- [ ] 点击 "🧮 Calculate" 按钮
- [ ] 查看是否显示估值结果
- [ ] 确认显示三档估值（保守/公允/乐观）
- [ ] 查看估值方法说明

### ✅ 保存功能
- [ ] 点击 "💾 Save" 按钮
- [ ] 检查 Airtable Valuations 表
- [ ] 确认记录已创建

### ✅ 历史查询
- [ ] 点击 "📚 History" 按钮
- [ ] 查看历史估值列表
- [ ] 检查是否显示之前保存的记录

### ✅ PDF 导出
- [ ] 点击 "📄 Export PDF" 按钮
- [ ] 新窗口打开报告
- [ ] 点击打印或保存为 PDF
- [ ] 检查报告格式和内容

---

## 📊 示例对话流程

**用户启动对话**

**Agent**: Hello! I'm here to help you estimate your business valuation. Let me start by asking about your annual revenue. What is your business's annual revenue in SGD?

**用户**: 500,000

**Agent**: Great! What is your net profit or EBITDA in SGD?

**用户**: 75,000

**Agent**: Thank you. What industry is your business in? (F&B, Retail, Services, Tech, etc.)

**用户**: Restaurant, F&B

**Agent**: How many years has your business been operating?

**用户**: 5 years

**Agent**: What is the estimated value of your business assets (equipment, inventory, etc.) in SGD?

**用户**: 50,000

**Agent**: Is your business revenue growing, stable, or declining?

**用户**: Stable

**Agent**: Are there any customer concentration risks or other risk factors I should know about?

**用户**: Top 3 customers account for 40% of revenue

**点击 "Calculate" 按钮**

估值结果显示：
- 🔻 Conservative: SGD 127,500
- ⚖️ Fair Market: SGD 150,000
- 🔺 Optimistic: SGD 172,500

---

## 🔧 故障排查

### 问题：Calculate 按钮无响应

**检查：**
1. 打开浏览器控制台查看错误
2. 确认已完成至少 7 个问答
3. 检查 ANTHROPIC_API_KEY 是否设置

### 问题：Save 失败

**检查：**
1. 确认 AIRTABLE_API_KEY 和 AIRTABLE_BASE_ID 正确
2. 确认 Valuations 表已创建
3. 确认字段名完全匹配（包括大小写和空格）
4. 运行 `npm run setup:airtable` 验证配置

### 问题：History 显示为空

**检查：**
1. 确认已成功保存至少一条记录
2. 检查 Airtable 中是否有记录
3. 打开浏览器控制台查看 API 错误

### 问题：PDF 导出失败

**检查：**
1. 确认浏览器允许弹窗
2. 尝试在隐私模式下测试
3. 检查估值结果是否完整

---

## 📚 API 端点说明

新增的 API 端点：

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/valuation/extract` | POST | 从对话中提取结构化数据 |
| `/api/valuation/calculate` | POST | 计算精确估值 |
| `/api/valuation/save` | POST | 保存估值到 Airtable |
| `/api/valuation/history` | GET | 查询历史估值 |
| `/api/valuation/export-pdf` | POST | 生成 PDF 报告 |

---

## 🎓 了解更多

- 📖 [完整 Airtable 配置指南](./AIRTABLE_SETUP.md)
- 📋 [Valuation Agent 需求文档](./Valuation%20Agent.md)
- 🔧 [技术架构说明](./README.md)

---

## ✅ 完成！

配置完成后，你的 Valuation Agent 已经完全就绪！

**已实现的功能：**
- ✅ 对话式数据收集
- ✅ 精确估值计算（硬编码算法）
- ✅ 结构化数据提取（AI驱动）
- ✅ Airtable 自动保存
- ✅ 历史记录查询和对比
- ✅ 专业 PDF 报告导出

开始使用：`npm run dev` 🚀
