# BizBroker AI — 产品需求文档 & 开发 Prompt

> 版本：v1.0 MVP · 日期：2026-05 · 市场：新加坡

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术栈](#2-技术栈)
3. [项目结构](#3-项目结构)
   - 3.1 [UI设计规范](#31-ui设计规范)
4. [5个AI Agent功能规范](#4-5个ai-agent功能规范)
5. [API接口规范](#5-api接口规范)
6. [数据库结构（Airtable）](#6-数据库结构airtable)
7. [环境变量](#7-环境变量)
   - [环境变量获取详细流程](#环境变量获取详细流程)
8. [数据流架构](#8-数据流架构)
9. [部署步骤](#9-部署步骤)
10. [成本估算](#10-成本估算)
11. [V2功能规划](#11-v2功能规划)
12. [完整开发Prompt](#12-完整开发prompt)

---

## 1. 项目概述

**BizBroker AI** 是一个面向新加坡中小企业（SME）的AI驱动并购经纪平台。

通过5个专业AI Agent，自动处理业务买卖的全流程：从卖家上架、估值分析、买家匹配，到尽职调查清单生成和买家资质评分。

### 核心价值

| 痛点               | 解决方案                      |
| ------------------ | ----------------------------- |
| 传统经纪耗时长     | AI Agent 24/7自动处理初步筛选 |
| 卖家不知如何定价   | Valuation Agent 自动估值      |
| 买家信息参差不齐   | Lead Qualification 自动评分   |
| DD清单繁琐         | Due Diligence Agent 一键生成  |
| 买卖双方匹配效率低 | Buyer Matching Agent 精准配对 |

---

## 2. 技术栈

| 层级   | 技术                    | 说明                       |
| ------ | ----------------------- | -------------------------- |
| 框架   | Next.js 14 App Router   | 全栈，SSR + API Routes     |
| 语言   | TypeScript              | 严格类型检查               |
| 样式   | Tailwind CSS            | 原子化CSS                  |
| AI     | Anthropic Claude Sonnet | `claude-sonnet-4-20250514` |
| 数据库 | Airtable                | 云端CRM，无需服务器        |
| 邮件   | Resend                  | 事务性邮件通知             |
| 部署   | Vercel                  | 新加坡节点 `sin1`          |

### 依赖包

```json
{
  "dependencies": {
    "next": "14.2.0",
    "react": "^18.3.0",
    "@anthropic-ai/sdk": "^0.24.0",
    "airtable": "^0.12.2",
    "resend": "^3.2.0",
    "zod": "^3.23.0",
    "lucide-react": "^0.383.0"
  },
  "devDependencies": {
    "typescript": "^5.4.5",
    "tailwindcss": "^3.4.3",
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0"
  }
}
```

---

## 3. 项目结构

```text
bizbroker-ai/
├── src/
│   ├── app/
│   │   ├── page.tsx                      ← 主页（5个Agent卡片）
│   │   ├── layout.tsx                    ← 根布局 + 字体加载
│   │   ├── globals.css                   ← 全局样式 + 动画
│   │   ├── agents/
│   │   │   └── [agentId]/
│   │   │       └── page.tsx              ← Agent对话页（动态路由）
│   │   ├── dashboard/
│   │   │   └── page.tsx                  ← 管理后台
│   │   └── api/
│   │       ├── chat/
│   │       │   └── route.ts              ← Claude AI对话接口
│   │       ├── leads/
│   │       │   └── route.ts              ← 买家线索 CRUD
│   │       └── listings/
│   │           └── route.ts              ← 商业上架 CRUD
│   ├── lib/
│   │   ├── agents.ts                     ← 5个Agent定义 + System Prompt
│   │   ├── airtable.ts                   ← 数据库读写（懒加载）
│   │   └── email.ts                      ← Resend邮件通知（懒加载）
│   └── types/
│       └── index.ts                      ← 全局TypeScript类型
├── vercel.json                            ← Vercel配置（sin1，超时30s）
├── .env.example                           ← 环境变量模板
├── next.config.mjs                        ← Next.js配置
├── tailwind.config.ts                     ← Tailwind配置
└── README.md
```

### 关键配置

#### vercel.json

```json
{
  "regions": ["sin1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

#### next.config.mjs

```js
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["airtable"],
  },
};
export default nextConfig;
```

---

## 3.1 UI设计规范

> 参考实现：`biz-broker-agents.jsx`

### 主题配色

**深色主题基调：**

- 背景色：`#0A0A0F`（极深灰黑）
- 卡片背景：`rgba(255,255,255,0.03)`
- 边框：`rgba(255,255,255,0.08-0.15)`
- 文字主色：`#fff`
- 文字次要色：`rgba(255,255,255,0.45-0.5)`

**Agent专属配色：**

```css
Agent 1 - Seller Onboarding:  #00D4AA  (青绿色)
Agent 2 - Valuation:          #FF6B35  (橙红色)
Agent 3 - Buyer Matching:     #845EF7  (紫色)
Agent 4 - Due Diligence:      #20C997  (翠绿色)
Agent 5 - Lead Qualification: #FFB84D  (金黄色)
```

### 关键UI组件样式

#### 1. Agent选择卡片

```tsx
{
  background: "rgba(255,255,255,0.03)",
  border: "1px solid {agentColor}33",
  borderRadius: 20,
  padding: 24,
  transition: "all 0.25s ease",
  // Hover效果
  onHover: {
    background: "{agentColor}10",
    border: "1px solid {agentColor}66",
    transform: "translateY(-4px)",
    boxShadow: "0 20px 40px {agentColor}20"
  }
}
```

#### 2. 对话气泡（Chat Bubble）

**用户消息：**

```tsx
{
  maxWidth: "75%",
  padding: "10px 14px",
  borderRadius: "18px 18px 4px 18px",  // 右下角尖角
  background: `linear-gradient(135deg, ${agentColor}, ${agentColor}cc)`,
  color: "#fff",
  fontSize: 14,
  lineHeight: 1.6
}
```

**AI回复：**

```tsx
{
  maxWidth: "75%",
  padding: "10px 14px",
  borderRadius: "18px 18px 18px 4px",  // 左下角尖角
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff",
  fontSize: 14,
  lineHeight: 1.6
}
```

**AI头像：**

```tsx
{
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: agentColor + "22",  // 半透明
  border: `2px solid ${agentColor}`,
  content: "🤖"
}
```

#### 3. 打字指示器（Typing Indicator）

```tsx
// 3个跳动的圆点
{
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: agentColor,
  animation: "bounce 1.2s ease-in-out ${i * 0.2}s infinite"
}
```

**动画定义：**

```css
@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}
```

#### 4. 输入框

```tsx
{
  background: "rgba(255,255,255,0.07)",
  border: `1px solid ${agentColor}44`,
  borderRadius: 12,
  padding: "10px 16px",
  color: "#fff",
  fontSize: 14
}
```

#### 5. 按钮样式

**主按钮（发送/开始）：**

```tsx
{
  background: `linear-gradient(135deg, ${agentColor}, ${agentColor}cc)`,
  border: "none",
  borderRadius: 12,
  padding: "10px 20px",
  color: "#000",  // 黑色文字在彩色背景上
  fontWeight: 700,
  fontSize: 14
}
```

**次要按钮（返回）：**

```tsx
{
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#fff",
  borderRadius: 8,
  padding: "6px 12px",
  fontSize: 13
}
```

### 核心动画

```css
/* 渐入上滑 */
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 跳动 */
@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

/* 脉冲闪烁 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* 渐变流动 */
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
```

### 字体配置

```css
body {
  fontFamily: "'Segoe UI', system-ui, sans-serif"
}

/* 标题字体 */
h1, .agent-title {
  fontFamily: "Georgia, serif"  /* 优雅衬线字体 */
}
```

**通过Google Fonts引入（推荐）：**

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
```

### 响应式布局

```tsx
// Agent Grid
{
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 16
}

// 标题字体自适应
{
  fontSize: "clamp(28px, 5vw, 48px)"  // 最小28px，最大48px
}
```

### 滚动条样式

```css
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.15);
  border-radius: 2px;
}
```

### 状态指示器

**在线状态（Active）：**

```tsx
{
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "#4ADE80",  // 绿色
  animation: "pulse 2s infinite"
}
```

---

## 4. 5个AI Agent功能规范

### Agent 1 — Seller Onboarding 🏪

**路由：** `/agents/onboarding`  
**优先级：** P1 核心  
**输出：** Listing Summary（Markdown格式）

**收集信息（逐一提问）：**

1. 业务名称和行业类型
2. 新加坡地区/地点
3. 运营年限
4. 年营收（SGD）
5. 净利润/EBITDA（SGD）
6. 员工数量（全职/兼职）
7. 出售资产清单（设备、库存、IP、客户群、租约）
8. 出售原因
9. 要价（或议价）
10. 独特卖点

**输出格式：**

```markdown
## 📋 LISTING SUMMARY

**Business:** [名称]
**Industry:** [行业]
**Location:** [地区], Singapore
**Established:** [年份]

### Financial Snapshot

| Metric           | Amount  |
| ---------------- | ------- |
| Annual Revenue   | SGD [X] |
| Net Profit       | SGD [X] |
| Asking Price     | SGD [X] |
| Revenue Multiple | [X]x    |

### Business Overview

[2-3句吸引人的描述]

### Key Assets Included

- [资产1]
- [资产2]

### Why This Opportunity

[1-2句投资亮点]

**Reason for Sale:** [原因]
**Team:** [X] full-time, [X] part-time
```

---

### Agent 2 — Valuation 📊

**路由：** `/agents/valuation`  
**优先级：** P1 核心  
**输出：** Valuation Report（含三种方法）

**新加坡SME估值基准：**

| 行业      | EBITDA倍数  | 营收倍数 |
| --------- | ----------- | -------- |
| 餐饮/零售 | 1.5–3x      | 0.3–0.6x |
| 服务/咨询 | 2–4x        | —        |
| 科技/SaaS | —           | 3–6x ARR |
| 教育/补习 | 2–4x        | —        |
| 制造业    | 3–5x + 资产 | —        |
| 电商      | 2–4x        | 0.5–1.5x |
| 医疗/诊所 | 3–5x        | —        |

**输出格式：**

```markdown
## 📊 VALUATION REPORT

### Methodology

| Method                  | Valuation | Weight |
| ----------------------- | --------- | ------ |
| Revenue Multiple ([X]x) | SGD [X]   | 30%    |
| EBITDA Multiple ([X]x)  | SGD [X]   | 50%    |
| Asset-Based             | SGD [X]   | 20%    |

### Estimated Range

🔻 Conservative: **SGD [X]**
⚖️ Fair Market: **SGD [X]**
🔺 Optimistic: **SGD [X]**

### Key Drivers

**Positives:** [列表]
**Risk discounts:** [列表]
```

---

### Agent 3 — Buyer Matching 🤝

**路由：** `/agents/matching`  
**优先级：** P1 核心  
**输出：** Buyer Profile + Match Report

**收集信息（逐一提问）：**

1. 总投资预算（含营运资金）
2. 资金来源（现金/银行贷款/投资者/组合）
3. 偏好行业（可多选）
4. 新加坡地区偏好（中/东/西/北/不限）
5. 亲力亲为 vs 被动投资偏好
6. 目标年化ROI（%）
7. 从商经验背景
8. 完成收购时间线
9. 特殊要求（清真认证、最短租约、最低营收等）

---

### Agent 4 — Due Diligence 🔍

**路由：** `/agents/diligence`  
**优先级：** P1 核心  
**输出：** 新加坡特定DD清单 + 红旗分析

**DD清单分类：**

- 📊 财务文件（3年P&L、资产负债表、IRAS税表、银行流水）
- ⚖️ 法律文件（ACRA商业信息、合同、IP注册）
- 🏢 运营（租约、设备、员工清单、客户集中度）
- 📋 新加坡监管（SFA/NEA/MOH许可证、CPF合规、MOM准证）

---

### Agent 5 — Lead Qualification ⭐

**路由：** `/agents/qualification`  
**优先级：** P1 核心  
**输出：** Lead Score Report（0-100分）

**评分维度：**

| 维度       | 满分 | 评分标准                         |
| ---------- | ---- | -------------------------------- |
| 资金准备度 | 30   | 现金买家30分，资金不明确0-5分    |
| 时间线     | 20   | 1-3个月18-20分，>12个月0-5分     |
| 从商经验   | 20   | 有买卖经验17-20分，无经验0-4分   |
| 认真程度   | 30   | 准备好NDA+顾问25-30分，模糊0-4分 |

**分级：**

- 🔥 Hot Lead：80+ 分 → 立即联系
- 🌡️ Warm Lead：50-79 分 → 24小时内
- ❄️ Cold Lead：<50 分 → 加入nurture列表

---

## 5. API接口规范

### POST `/api/chat`

```typescript
// Request
{
  agentId: "onboarding" | "valuation" | "matching" | "diligence" | "qualification",
  messages: Array<{ role: "user" | "assistant", content: string }>,
  sessionId?: string
}

// Response
{
  message: string,
  sessionId: string
}
```

### POST `/api/listings`

```typescript
// Request
{ listing: BusinessListing }

// Response
{ success: boolean, recordId: string }

// 副作用：
// 1. 保存到Airtable Listings表
// 2. 邮件通知Admin审核
// 3. 确认邮件发给卖家
```

### GET `/api/listings`

```http
GET /api/listings?status=active
GET /api/listings?status=pending+review
GET /api/listings  (返回全部非Withdrawn)

Response: { listings: AirtableListingRecord[] }
```

### POST `/api/leads`

```typescript
// Request
{ lead: BuyerLead, chatSummary?: string }

// Response
{ success: boolean, recordId: string, tier: "hot" | "warm" | "cold" }

// 副作用：
// 保存到Airtable Leads表 + 邮件通知Admin
```

### GET `/api/leads`

```http
GET /api/leads?tier=hot
GET /api/leads  (返回全部，按Lead Score降序)

Response: { leads: AirtableLeadRecord[] }
```

> ⚠️ **重要：** 所有API路由文件顶部必须加：
>
> ```typescript
> export const dynamic = "force-dynamic";
> ```

---

## 6. 数据库结构（Airtable）

### 表1：Listings

| 字段名               | 类型             | 说明                                       |
| -------------------- | ---------------- | ------------------------------------------ |
| Business Name        | Single line text | 业务名称                                   |
| Industry             | Single line text | 行业                                       |
| Description          | Long text        | 描述                                       |
| Location             | Single line text | 新加坡地区                                 |
| Years in Operation   | Number           | 运营年限                                   |
| Annual Revenue (SGD) | Currency         | 年营收                                     |
| Net Profit (SGD)     | Currency         | 净利润                                     |
| Asking Price (SGD)   | Currency         | 要价                                       |
| Employees            | Number           | 员工数                                     |
| Reason for Selling   | Long text        | 出售原因                                   |
| Key Assets           | Long text        | 关键资产                                   |
| Status               | Single select    | Pending Review / Active / Sold / Withdrawn |
| Seller Name          | Single line text | 卖家姓名                                   |
| Seller Email         | Email            | 卖家邮箱                                   |
| Seller Phone         | Phone            | 卖家电话                                   |
| AI Summary           | Long text        | AI生成摘要                                 |
| Valuation Low        | Currency         | 估值低位                                   |
| Valuation Mid        | Currency         | 估值中位                                   |
| Valuation High       | Currency         | 估值高位                                   |
| Created              | Created time     | 自动生成                                   |

### 表2：Leads

| 字段名                  | 类型             | 说明                                                |
| ----------------------- | ---------------- | --------------------------------------------------- |
| Name                    | Single line text | 买家姓名                                            |
| Email                   | Email            | 邮箱                                                |
| Phone                   | Phone            | 电话                                                |
| Budget (SGD)            | Currency         | 预算                                                |
| Funding Source          | Single line text | 资金来源                                            |
| Preferred Industries    | Long text        | 偏好行业                                            |
| Preferred Location      | Single line text | 偏好地区                                            |
| Timeline                | Single line text | 收购时间线                                          |
| Has Business Experience | Checkbox         | 有无从商经验                                        |
| ROI Expectation (%)     | Number           | 期望回报率                                          |
| Lead Score              | Number           | 综合评分 0-100                                      |
| Tier                    | Single select    | 🔥 Hot / 🌡️ Warm / ❄️ Cold                          |
| Status                  | Single select    | New / Contacted / Qualified / Nurturing / Converted |
| Score Breakdown         | Long text        | 评分明细（JSON）                                    |
| Chat Summary            | Long text        | 对话摘要                                            |
| Created                 | Created time     | 自动生成                                            |

---

## 7. 环境变量

复制 `.env.example` 为 `.env.local`，填入以下值：

```env
# Anthropic Claude API
# 获取地址：https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx

# Airtable（CRM数据库）
# API Key：https://airtable.com/create/tokens
# Base ID：在Base URL中找 appXXXXX
AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX

# Resend（邮件通知）
# 获取地址：https://resend.com/api-keys
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXX
RESEND_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# 应用配置
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 环境变量获取详细流程

#### 1. AIRTABLE_BASE_ID

1. 登录 [airtable.com](https://airtable.com)
2. 点击左侧你创建的 **BizBroker** Base
3. 在浏览器地址栏中查看URL：`https://airtable.com/appXXXXXXXXXXXXXX/...`
4. 复制 `app` 开头的ID（例如：`appAbCd1234567890`）
5. 粘贴到 `.env.local` 的 `AIRTABLE_BASE_ID=` 后面

**或者通过API文档获取：**

1. 访问 [https://airtable.com/developers/web/api/introduction](https://airtable.com/developers/web/api/introduction)
2. 选择你的 Base，在文档URL中即可看到Base ID

#### 2. ADMIN_EMAIL

这是**你自己的邮箱地址**，用于接收系统通知：

- 新卖家提交Listing时的审核通知
- 新买家Lead入库时的提醒
- 热门Lead（🔥 Hot Lead）的即时通知

**示例：**

```env
ADMIN_EMAIL=yourname@company.com
```

或使用你的个人邮箱：

```env
ADMIN_EMAIL=yourname@gmail.com
```

#### 3. NEXT_PUBLIC_APP_URL

这是你的**应用最终部署的URL**：

**本地开发时：**

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Vercel部署后：**

1. 部署完成后，Vercel会提供一个默认域名（例如：`bizbroker-ai-vercel.vercel.app`）
2. 复制完整的URL：

```env
NEXT_PUBLIC_APP_URL=https://bizbroker-ai-vercel.vercel.app
```

**自定义域名：**

如果你添加了自定义域名（例如：`bizbroker.sg`），使用自定义域名：

```env
NEXT_PUBLIC_APP_URL=https://bizbroker.sg
```

> ⚠️ **注意：**
>
> - 本地开发用 `http://localhost:3000`
> - 生产环境必须用 `https://` 开头
> - 末尾不要加斜杠 `/`
>
> **Resend 和 Airtable 必须使用懒加载初始化**，避免 build 时因缺少环境变量报错：
>
> ```typescript
> // ✅ 正确：懒加载
> const getResend = () => new Resend(process.env.RESEND_API_KEY!);
>
> // ❌ 错误：模块顶层初始化
> const resend = new Resend(process.env.RESEND_API_KEY);
> ```

---

## 8. 数据流架构

### 卖家流程

```text
卖家访问网站
    ↓
/agents/onboarding（对话收集信息）
    ↓
POST /api/chat → Claude AI生成Listing Summary
    ↓
POST /api/listings → 保存到Airtable（Status: Pending Review）
    ↓
Resend发送邮件 → Admin审核通知 + 卖家确认邮件
    ↓
Admin在Dashboard审核 → 改Status为Active
    ↓
上架成功，买家可查看
```

### 买家流程

```text
买家访问网站
    ↓
/agents/qualification（资质评估对话）
    ↓
POST /api/chat → Claude AI评分0-100
    ↓
POST /api/leads → 保存到Airtable（含Tier分级）
    ↓
如果是🔥 Hot Lead → Resend立即邮件通知Admin
    ↓
Admin在Dashboard查看 → 主动联系买家
```

---

## 9. 部署步骤

### 本地开发

```bash
# 1. 解压项目
unzip bizbroker-ai-vercel.zip
cd bizbroker-ai-vercel

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入所有API Keys

# 4. 启动开发服务器
npm run dev
# 访问 http://localhost:3000

# 5. 构建验证
npm run build
```

### Airtable配置

1. 登录 [airtable.com](https://airtable.com)
2. 创建新Base，命名为 **BizBroker**
3. 按第6节的字段清单创建 **Listings** 和 **Leads** 两张表
4. 获取API Token：Profile → Developer Hub → Personal Access Token
   - 权限范围：`data.records:read`、`data.records:write`
5. 获取Base ID：在Base URL中找 `appXXXXXXXX`

### Vercel部署

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署（首次）
vercel

# 添加环境变量（逐个添加）
vercel env add ANTHROPIC_API_KEY
vercel env add AIRTABLE_API_KEY
vercel env add AIRTABLE_BASE_ID
vercel env add RESEND_API_KEY
vercel env add RESEND_FROM_EMAIL
vercel env add ADMIN_EMAIL
vercel env add NEXT_PUBLIC_APP_URL

# 生产部署
vercel --prod
```

**或通过Vercel Dashboard：**

1. push代码到GitHub
2. vercel.com → New Project → Import from GitHub
3. Settings → Environment Variables → 添加所有变量
4. Deploy

> 📍 部署区域已在 `vercel.json` 设为 `sin1`（新加坡），确保最低延迟。

---

## 10. 成本估算

| 服务             | 免费套餐         | 规模化费用/月   |
| ---------------- | ---------------- | --------------- |
| Vercel           | 100GB带宽        | ~SGD 25（Pro）  |
| Anthropic Claude | 按Token计费      | ~SGD 15–50      |
| Airtable         | 1,000条记录/Base | ~SGD 25（Team） |
| Resend           | 3,000封邮件/月   | ~SGD 25         |
| **合计**         | **早期约SGD 0**  | **~SGD 90/月**  |

---

## 11. V2功能规划

| 功能                      | 优先级 | 说明                             |
| ------------------------- | ------ | -------------------------------- |
| WhatsApp通知（Twilio）    | P2     | 热线索立即WhatsApp通知Admin      |
| 管理员登录（NextAuth.js） | P2     | Dashboard加密码/Google OAuth保护 |
| 对话记忆持久化            | P2     | Agent跨会话记住用户历史          |
| PDF报告生成               | P3     | 估值报告/DD清单一键导出PDF       |
| Calendly集成              | P3     | 自动预约看盘/面谈                |
| 买卖家自动匹配            | P3     | 新上架时邮件通知符合条件的买家   |
| 买家NDA签署               | P3     | HelloSign/DocuSign集成           |

---

## 12. 完整开发Prompt

以下Prompt可直接复制给开发者或AI助手继续开发：

---

```markdown
请开发 BizBroker AI 项目，这是一个面向新加坡中小企业的AI驱动并购经纪平台。

【技术栈】
- 框架：Next.js 14 App Router + TypeScript
- 样式：Tailwind CSS
- AI：Anthropic Claude Sonnet（claude-sonnet-4-20250514，max_tokens: 1500）
- 数据库：Airtable（无需服务器，云端CRM）
- 邮件：Resend（事务性邮件）
- 部署：Vercel（region: sin1 新加坡）

【项目结构】
src/app/
  page.tsx                    ← 主页，展示5个Agent选择卡片
  agents/[agentId]/page.tsx   ← 动态路由，所有Agent共用同一个对话UI
  dashboard/page.tsx          ← 管理后台，展示Leads和Listings
  api/chat/route.ts           ← POST，调用Claude API
  api/leads/route.ts          ← GET/POST，买家线索管理
  api/listings/route.ts       ← GET/POST，商业上架管理
src/lib/
  agents.ts                   ← 5个Agent定义和完整System Prompt
  airtable.ts                 ← Airtable读写（必须懒加载）
  email.ts                    ← Resend邮件（必须懒加载）
src/types/index.ts            ← TypeScript类型定义

【5个Agent ID和职责】
- onboarding：逐步收集卖家信息，生成格式化上市说明书
- valuation：用Revenue/EBITDA/Asset三种方法估值，输出SGD区间
- matching：收集买家偏好，匹配适合的新加坡业务类别
- diligence：生成新加坡特定DD清单，标记红旗风险项
- qualification：四维评分（资金/时间线/经验/认真度），输出0-100分，分Hot/Warm/Cold

【关键技术要求】
1. 所有API路由顶部加：export const dynamic = "force-dynamic"
2. Resend和Airtable必须懒加载初始化，不能在模块顶层实例化
3. vercel.json配置 region: sin1，API maxDuration: 30
4. 字体通过<link>标签引入Google Fonts（Playfair Display + JetBrains Mono）
5. CSS变量定义在globals.css的:root中

【Airtable表结构】
Listings表：Business Name, Industry, Description, Location, Years in Operation,
Annual Revenue (SGD), Net Profit (SGD), Asking Price (SGD), Employees,
Reason for Selling, Key Assets, Status(Pending Review/Active/Sold/Withdrawn),
Seller Name, Seller Email, Seller Phone, AI Summary,
Valuation Low, Valuation Mid, Valuation High, Created

Leads表：Name, Email, Phone, Budget (SGD), Funding Source,
Preferred Industries, Preferred Location, Timeline,
Has Business Experience(Checkbox), ROI Expectation(%),
Lead Score, Tier(🔥 Hot/🌡️ Warm/❄️ Cold),
Status(New/Contacted/Qualified/Nurturing/Converted),
Score Breakdown(JSON字符串), Chat Summary, Created

【邮件通知逻辑】
- 新Listing提交 → Admin收到审核通知 + 卖家收到确认邮件
- 新Lead保存 → Admin收到含评分和分级的通知邮件
- 所有邮件fire-and-forget（不阻塞API响应）

【UI风格要求】
- 深色主题（background: #0A0A0F）
- 每个Agent有专属accent颜色
- 对话气泡支持简单Markdown渲染（粗体、标题、列表、表格、分割线）
- 打字动画（3个跳动圆点）
- 响应式设计，移动端友好

【环境变量】
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXX
RESEND_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

请按以上规格实现完整的生产级代码，确保 npm run build 能通过。
```

---

## 文档结束

BizBroker AI v1.0 MVP · 新加坡市场 · 如需更新请修改对应章节
