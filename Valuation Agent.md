# Valuation Agent / 估值代理 MVP

## 核心功能
根据收入、利润、行业、资产和风险等级估算估值范围，为新加坡中小企业提供专业的估值分析。

## MVP 功能范围

### 1. 数据收集（对话式）
通过自然对话收集以下信息：
- **年收入** (Annual Revenue) - 新币金额
- **净利润/EBITDA** (Net Profit/EBITDA) - 新币金额
- **行业类型** (Industry) - 餐饮、零售、服务、科技、教育等
- **经营年限** (Years in Operation)
- **资产价值** (Asset Value) - 设备、存货等
- **增长趋势** (Growth Trend) - 增长中/稳定/下滑
- **风险因素** (Risk Factors) - 客户集中度、市场竞争等

### 2. 估值计算方法

根据行业应用不同的估值倍数：

| 行业 | 收入倍数 | EBITDA倍数 |
|------|---------|-----------|
| 餐饮/零售 | 0.3-0.6x | 1.5-3x |
| 服务/咨询 | - | 2-4x |
| 科技/SaaS | 3-6x ARR | - |
| 教育/培训 | - | 2-4x |
| 制造业 | - | 3-5x + 资产 |
| 电商 | 0.5-1.5x | 2-4x |
| 医疗/诊所 | - | 3-5x |

**估值计算逻辑：**
1. **收入法** (30%权重): 年收入 × 行业收入倍数
2. **利润法** (50%权重): EBITDA × 行业EBITDA倍数
3. **资产法** (20%权重): 净资产价值

**最终范围：**
- 🔻 保守估值 (Conservative): 加权平均 × 0.85
- ⚖️ 公允价值 (Fair Market): 加权平均
- 🔺 乐观估值 (Optimistic): 加权平均 × 1.15

### 3. 估值报告输出

生成结构化的估值报告，包含：

```
## 📊 估值报告 / VALUATION REPORT

### 估值方法 / Methodology
| 方法 | 估值 | 权重 |
|------|------|------|
| 收入倍数 | SGD XXX | 30% |
| EBITDA倍数 | SGD XXX | 50% |
| 资产基础 | SGD XXX | 20% |

### 估值范围 / Estimated Range
🔻 保守估值: **SGD XXX**
⚖️ 公允价值: **SGD XXX**
🔺 乐观估值: **SGD XXX**

### 价值驱动因素 / Key Drivers
**正面因素 Positives:**
- [增值因素列表]

**风险折扣 Risk Discounts:**
- [减值因素列表]

### 建议 / Recommendations
[基于估值的定价建议]
```

### 4. MVP技术实现

**已完成：**
- ✅ 对话式界面 (src/app/agents/[agentId]/page.tsx)
- ✅ Claude API集成 (src/app/api/chat/route.ts)
- ✅ Valuation Agent系统提示词 (src/lib/agents.ts)
- ✅ 类型定义 (src/types/index.ts)

**待增强（可选）：**
- [ ] 结构化数据提取API
- [ ] 自动保存估值到Airtable
- [ ] PDF估值报告导出
- [ ] 历史估值对比

## 使用流程

1. 用户访问 `/agents/valuation`
2. 点击"Start Conversation"开始对话
3. Agent逐步询问所需信息
4. 收集完信息后，Agent计算估值范围
5. 展示专业的估值报告
6. 用户可继续询问调整参数

## 成功指标

- ✅ 能够完成一次完整的估值对话流程
- ✅ 估值范围计算准确且合理
- ✅ 报告格式清晰专业
- ✅ 响应时间 < 3秒

