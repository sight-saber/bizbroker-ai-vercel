# 📖 使用示例 - Valuation Agent

**标准输入输出参考**

---

## 🎯 完整对话流程示例

### 示例 1: 餐厅估值 (F&B/Retail)

#### 📝 对话记录:

**AI Agent:**
> 你好！我是商业估值代理。我将通过7个问题帮你评估企业价值。让我们开始吧！
>
> **问题 1/7:** 你的企业叫什么名字？

**用户:**
> 小龙坎火锅店

**AI Agent:**
> 好的，小龙坎火锅店。
>
> **问题 2/7:** 你的企业所属行业是什么？
> - 餐饮/零售 (F&B/Retail)
> - 服务/咨询 (Services)
> - 科技/SaaS (Tech/SaaS)
> - 教育/培训 (Education)
> - 制造业 (Manufacturing)
> - 电商 (E-commerce)
> - 医疗/诊所 (Healthcare)

**用户:**
> 餐饮

**AI Agent:**
> 明白了。
>
> **问题 3/7:** 你的年度营业额是多少？（新币SGD）

**用户:**
> 120万

**AI Agent:**
> 收到。年营业额 SGD $1,200,000
>
> **问题 4/7:** 你的年度净利润是多少？（新币SGD）

**用户:**
> 18万

**AI Agent:**
> 好的。净利润 SGD $180,000
>
> **问题 5/7:** 你的企业经营了多少年？

**用户:**
> 3年

**AI Agent:**
> 3年经营历史。
>
> **问题 6/7:** 你的有形资产价值是多少？（如设备、装修、库存等，新币SGD）

**用户:**
> 大概15万吧

**AI Agent:**
> 资产价值 SGD $150,000
>
> **问题 7/7:** 你的业务增长趋势如何？
> - 增长中 (Growing)
> - 稳定 (Stable)
> - 下降中 (Declining)

**用户:**
> 稳定增长

**AI Agent:**
> 完美！我已经收集到所有信息。
>
> 📊 **收集的数据:**
> - 企业名称: 小龙坎火锅店
> - 行业: 餐饮/零售
> - 年营业额: SGD $1,200,000
> - 净利润: SGD $180,000
> - 经营年限: 3年
> - 资产价值: SGD $150,000
> - 增长趋势: 稳定增长
>
> 请点击"🧮 Calculate"按钮获取估值结果。

#### 📊 估值结果:

```json
{
  "businessName": "小龙坎火锅店",
  "industry": "fnb_retail",
  "annualRevenue": 1200000,
  "netProfit": 180000,
  "ebitda": 180000,
  "yearsInOperation": 3,
  "assetValue": 150000,
  "growthTrend": "growing",

  "valuations": {
    "conservative": "SGD $396,562",
    "fairMarket": "SGD $466,500",
    "optimistic": "SGD $536,438"
  },

  "methodology": [
    {
      "method": "Revenue Multiple (0.5x)",
      "value": "SGD $540,000",
      "weight": "30%"
    },
    {
      "method": "EBITDA Multiple (2.3x)",
      "value": "SGD $405,000",
      "weight": "50%"
    },
    {
      "method": "Asset-Based",
      "value": "SGD $150,000",
      "weight": "20%"
    }
  ],

  "positiveFactors": [
    "✅ 稳定的盈利能力（利润率15%）",
    "✅ 业务增长趋势良好"
  ],

  "riskFactors": [
    "⚠️ 经营时间较短（<5年）",
    "⚠️ 餐饮行业竞争激烈"
  ],

  "recommendation": "基于餐饮零售行业基准和您的业务指标，合理要价约为 SGD $466,500（年营业额的0.4倍）。建议从乐观价格开始谈判，准备在公允市场价值附近成交。"
}
```

---

## 📋 标准输入格式

### 必填字段:

```typescript
{
  "businessName": "企业名称",              // 字符串
  "industry": "fnb_retail",                // 枚举值（见下方）
  "annualRevenue": 1200000,                // 数字（SGD）
  "netProfit": 180000,                     // 数字（SGD）
  "yearsInOperation": 3,                   // 数字（年）
  "assetValue": 150000,                    // 数字（SGD）
  "growthTrend": "growing"                 // 枚举：growing/stable/declining
}
```

### 行业类型 (Industry Types):

| 值 | 中文 | 英文 |
|----|------|------|
| `fnb_retail` | 餐饮/零售 | F&B/Retail |
| `services` | 服务/咨询 | Services/Consulting |
| `tech_saas` | 科技/SaaS | Tech/SaaS |
| `education` | 教育/培训 | Education/Tuition |
| `manufacturing` | 制造业 | Manufacturing |
| `ecommerce` | 电商 | E-commerce |
| `healthcare` | 医疗/诊所 | Healthcare/Clinic |

---

## 📊 标准输出格式

### 估值结果结构:

```typescript
{
  "success": true,
  "data": {
    "input": {
      "businessName": "企业名称",
      "industry": "fnb_retail",
      "annualRevenue": 1200000,
      "netProfit": 180000,
      "ebitda": 180000,
      "yearsInOperation": 3,
      "assetValue": 150000,
      "growthTrend": "growing"
    },

    "methods": [
      {
        "method": "Revenue Multiple (0.5x)",
        "value": 540000,
        "multiplier": 0.45,
        "weight": 0.3
      },
      {
        "method": "EBITDA Multiple (2.3x)",
        "value": 405000,
        "multiplier": 2.25,
        "weight": 0.5
      },
      {
        "method": "Asset-Based",
        "value": 150000,
        "multiplier": 1,
        "weight": 0.2
      }
    ],

    "conservative": 396562.5,      // 公允价值 * 0.85
    "fairMarket": 466500,          // 加权平均值
    "optimistic": 536437.5,        // 公允价值 * 1.15
    "weightedAverage": 466500,

    "positiveFactors": [
      "稳定的盈利能力（利润率15%）",
      "业务增长趋势良好"
    ],

    "riskFactors": [
      "经营时间较短（<5年）",
      "餐饮行业竞争激烈"
    ],

    "recommendations": "基于餐饮零售行业基准...",

    "calculatedAt": "2026-05-13T14:30:00.000Z"
  }
}
```

---

## 🔧 API 调用示例

### 1. 数据提取 API

**Endpoint:** `POST /api/valuation/extract`

**请求:**
```bash
curl -X POST http://localhost:3000/api/valuation/extract \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "assistant", "content": "你的企业叫什么名字？"},
      {"role": "user", "content": "小龙坎火锅店"},
      {"role": "assistant", "content": "你的企业所属行业是什么？"},
      {"role": "user", "content": "餐饮"},
      {"role": "assistant", "content": "年度营业额是多少？"},
      {"role": "user", "content": "120万"},
      {"role": "assistant", "content": "年度净利润是多少？"},
      {"role": "user", "content": "18万"},
      {"role": "assistant", "content": "经营了多少年？"},
      {"role": "user", "content": "3年"},
      {"role": "assistant", "content": "有形资产价值多少？"},
      {"role": "user", "content": "15万"},
      {"role": "assistant", "content": "业务增长趋势如何？"},
      {"role": "user", "content": "稳定增长"}
    ]
  }'
```

**响应:**
```json
{
  "success": true,
  "data": {
    "businessName": "小龙坎火锅店",
    "industry": "fnb_retail",
    "annualRevenue": 1200000,
    "netProfit": 180000,
    "ebitda": 180000,
    "yearsInOperation": 3,
    "assetValue": 150000,
    "growthTrend": "growing"
  }
}
```

---

### 2. 估值计算 API

**Endpoint:** `POST /api/valuation/calculate`

**请求:**
```bash
curl -X POST http://localhost:3000/api/valuation/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "小龙坎火锅店",
    "industry": "fnb_retail",
    "annualRevenue": 1200000,
    "netProfit": 180000,
    "ebitda": 180000,
    "yearsInOperation": 3,
    "assetValue": 150000,
    "growthTrend": "growing"
  }'
```

**响应:**
```json
{
  "success": true,
  "data": {
    "conservative": 396562.5,
    "fairMarket": 466500,
    "optimistic": 536437.5,
    "weightedAverage": 466500,
    "methods": [...],
    "positiveFactors": [...],
    "riskFactors": [...],
    "recommendations": "...",
    "calculatedAt": "2026-05-13T14:30:00.000Z"
  }
}
```

---

### 3. 保存估值 API

**Endpoint:** `POST /api/valuation/save`

**请求:**
```bash
curl -X POST http://localhost:3000/api/valuation/save \
  -H "Content-Type: application/json" \
  -d '{
    "input": {...},
    "conservative": 396562.5,
    "fairMarket": 466500,
    "optimistic": 536437.5,
    "methods": [...],
    "positiveFactors": [...],
    "riskFactors": [...],
    "recommendations": "...",
    "calculatedAt": "2026-05-13T14:30:00.000Z"
  }'
```

**响应:**
```json
{
  "success": true,
  "recordId": "recXXXXXXXXXXXXXX",
  "message": "Valuation saved successfully"
}
```

---

### 4. 查询历史 API

**Endpoint:** `GET /api/valuation/history`

**请求:**
```bash
curl http://localhost:3000/api/valuation/history
```

**响应:**
```json
{
  "success": true,
  "data": {
    "valuations": [
      {
        "id": "recXXXXXXXXXXXXXX",
        "input": {...},
        "conservative": 396562.5,
        "fairMarket": 466500,
        "optimistic": 536437.5,
        "created": "2026-05-13T14:30:00.000Z"
      }
    ],
    "count": 1
  }
}
```

---

## 📚 更多行业示例

### 示例 2: 科技公司 (Tech/SaaS)

**输入:**
```json
{
  "businessName": "CloudSync SaaS",
  "industry": "tech_saas",
  "annualRevenue": 500000,
  "netProfit": 100000,
  "ebitda": 120000,
  "yearsInOperation": 2,
  "assetValue": 50000,
  "growthTrend": "growing"
}
```

**输出:**
```json
{
  "conservative": "SGD $1,164,500",
  "fairMarket": "SGD $1,370,000",
  "optimistic": "SGD $1,575,500",

  "methodology": [
    {
      "method": "Revenue Multiple (4.5x)",
      "value": "SGD $2,250,000",
      "weight": "30%"
    },
    {
      "method": "EBITDA Multiple (3.5x)",
      "value": "SGD $420,000",
      "weight": "50%"
    },
    {
      "method": "Asset-Based",
      "value": "SGD $50,000",
      "weight": "20%"
    }
  ]
}
```

---

### 示例 3: 教育机构 (Education)

**输入:**
```json
{
  "businessName": "优学教育中心",
  "industry": "education",
  "annualRevenue": 800000,
  "netProfit": 200000,
  "ebitda": 200000,
  "yearsInOperation": 6,
  "assetValue": 100000,
  "growthTrend": "stable"
}
```

**输出:**
```json
{
  "conservative": "SGD $530,000",
  "fairMarket": "SGD $623,529",
  "optimistic": "SGD $717,059",

  "methodology": [
    {
      "method": "EBITDA Multiple (3.0x)",
      "value": "SGD $600,000",
      "weight": "50%"
    },
    {
      "method": "Asset-Based",
      "value": "SGD $100,000",
      "weight": "20%"
    }
  ],

  "positiveFactors": [
    "✅ 成熟业务，有良好的历史记录（6年）",
    "✅ 高利润率（25%）"
  ]
}
```

---

### 示例 4: 电商平台 (E-commerce)

**输入:**
```json
{
  "businessName": "新加坡购物网",
  "industry": "ecommerce",
  "annualRevenue": 2000000,
  "netProfit": 150000,
  "ebitda": 180000,
  "yearsInOperation": 4,
  "assetValue": 200000,
  "growthTrend": "growing"
}
```

**输出:**
```json
{
  "conservative": "SGD $816,000",
  "fairMarket": "SGD $960,000",
  "optimistic": "SGD $1,104,000",

  "methodology": [
    {
      "method": "Revenue Multiple (1.0x)",
      "value": "SGD $2,000,000",
      "weight": "30%"
    },
    {
      "method": "EBITDA Multiple (3.0x)",
      "value": "SGD $540,000",
      "weight": "50%"
    },
    {
      "method": "Asset-Based",
      "value": "SGD $200,000",
      "weight": "20%"
    }
  ]
}
```

---

## 🧪 测试数据集

### 快速测试用例:

```json
[
  {
    "name": "小型餐厅",
    "data": {
      "businessName": "小食堂",
      "industry": "fnb_retail",
      "annualRevenue": 500000,
      "netProfit": 75000,
      "yearsInOperation": 5,
      "assetValue": 50000,
      "growthTrend": "stable"
    },
    "expectedFairMarket": "~161,875"
  },
  {
    "name": "咨询公司",
    "data": {
      "businessName": "智慧咨询",
      "industry": "services",
      "annualRevenue": 500000,
      "netProfit": 100000,
      "yearsInOperation": 8,
      "assetValue": 20000,
      "growthTrend": "growing"
    },
    "expectedFairMarket": "~304,000"
  },
  {
    "name": "初创SaaS",
    "data": {
      "businessName": "StartupSaaS",
      "industry": "tech_saas",
      "annualRevenue": 300000,
      "netProfit": 50000,
      "yearsInOperation": 1,
      "assetValue": 30000,
      "growthTrend": "growing"
    },
    "expectedFairMarket": "~756,000"
  }
]
```

---

## 📝 使用建议

### 1. 数据准备

**建议准备以下文件:**
- 财务报表（最近1-3年）
- 资产清单（设备、库存、装修）
- 业务增长趋势数据
- 客户合同/订单记录

### 2. 行业选择

**选择最符合的行业类型:**
- 餐饮店 → `fnb_retail`
- 线上商店 → `ecommerce`
- SaaS软件 → `tech_saas`
- 培训中心 → `education`
- 诊所/医疗 → `healthcare`
- 咨询/服务 → `services`
- 工厂/生产 → `manufacturing`

### 3. 数值准确性

**确保数值准确:**
- ✅ 年营业额 = 全年总收入
- ✅ 净利润 = 税后利润
- ✅ 资产价值 = 有形资产的市场价值
- ✅ 使用新币 SGD 计算

### 4. 增长趋势

**如何判断:**
- `growing` - 最近1-2年营收增长 >10%
- `stable` - 营收波动 <±10%
- `declining` - 营收下降 >10%

---

## ⚠️ 重要提示

1. **估值仅供参考**
   - AI估值基于行业基准和输入数据
   - 实际交易价格受多种因素影响
   - 建议咨询专业评估师

2. **数据隐私**
   - 所有数据存储在 Airtable
   - 不会公开分享
   - 仅用于历史记录查询

3. **估值范围**
   - Conservative (保守): 公允价值 × 0.85
   - Fair Market (公允): 加权平均估值
   - Optimistic (乐观): 公允价值 × 1.15

4. **行业乘数**
   - 餐饮/零售: 0.3-0.6x 营收, 1.5-3x EBITDA
   - 科技/SaaS: 3-6x 营收
   - 服务/咨询: 2-4x EBITDA
   - 教育: 2-4x EBITDA
   - 制造业: 3-5x EBITDA
   - 电商: 0.5-1.5x 营收, 2-4x EBITDA
   - 医疗: 3-5x EBITDA

---

## 📞 技术支持

**遇到问题？**
- 查看 [QUICK_START.md](./QUICK_START.md) - 快速入门
- 查看 [TESTING_GUIDE.md](./TESTING_GUIDE.md) - 测试指南
- 查看 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - 部署指南

---

**Built for Singapore SMEs** 🇸🇬
**Status:** Production Ready ✅
