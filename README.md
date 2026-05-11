# BizBroker AI

AI驱动的新加坡中小企业并购经纪平台

## 项目概述

BizBroker AI 通过5个专业AI Agent自动处理业务买卖的全流程：
- 🏪 Seller Onboarding - 卖家上架
- 📊 Valuation - 估值分析
- 🤝 Buyer Matching - 买家匹配
- 🔍 Due Diligence - 尽职调查
- ⭐ Lead Qualification - 资质评分

## 技术栈

- **框架**: Next.js 14 App Router
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **AI**: Anthropic Claude Sonnet
- **数据库**: Airtable
- **邮件**: Resend
- **部署**: Vercel (Singapore region)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填入以下信息：

```bash
cp .env.example .env.local
```

需要配置的环境变量：
- `ANTHROPIC_API_KEY` - 从 https://console.anthropic.com/ 获取
- `AIRTABLE_API_KEY` - 从 https://airtable.com/create/tokens 获取
- `AIRTABLE_BASE_ID` - 在 Airtable Base URL 中找到
- `RESEND_API_KEY` - 从 https://resend.com/api-keys 获取
- `RESEND_FROM_EMAIL` - 发件邮箱
- `ADMIN_EMAIL` - 管理员邮箱
- `NEXT_PUBLIC_APP_URL` - 应用URL

详细获取流程请查看 [BizBroker-AI-PRD.md](./BizBroker-AI-PRD.md#环境变量获取详细流程)

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 部署到 Vercel

### 方法一：Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

### 方法二：GitHub集成

1. 将代码推送到 GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 导入 GitHub 仓库
4. 添加环境变量
5. 部署

## 项目结构

```
bizbroker-ai/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 主页
│   │   ├── layout.tsx            # 根布局
│   │   ├── globals.css           # 全局样式
│   │   ├── agents/[agentId]/     # Agent对话页
│   │   ├── dashboard/            # 管理后台
│   │   └── api/                  # API路由
│   │       ├── chat/             # AI对话接口
│   │       ├── leads/            # 买家线索
│   │       └── listings/         # 商业上架
│   ├── lib/
│   │   ├── agents.ts             # Agent定义
│   │   ├── airtable.ts           # 数据库操作
│   │   └── email.ts              # 邮件发送
│   └── types/
│       └── index.ts              # 类型定义
├── vercel.json                   # Vercel配置
├── next.config.mjs               # Next.js配置
├── tailwind.config.ts            # Tailwind配置
└── README.md
```

## 文档

完整的产品需求文档和开发指南请查看：[BizBroker-AI-PRD.md](./BizBroker-AI-PRD.md)

## 许可证

[MIT License](./LICENSE)
