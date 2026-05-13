# 🧪 Valuation Agent Testing Guide

## 测试计划总览

### 测试环境
- **本地开发**: http://localhost:3000
- **浏览器**: Chrome, Safari, Firefox
- **设备**: Desktop, Mobile (iOS/Android)

---

## Task 1: 对话流程测试 ✅

### 测试用例 1.1: 基础对话流程

**前置条件:**
- 开发服务器运行中
- Airtable已配置
- Claude API Key有效

**测试步骤:**
1. 访问 http://localhost:3000
2. 点击 Valuation Agent 卡片
3. 点击 "Start Conversation"
4. 观察 Agent 的首条消息

**预期结果:**
- ✅ 页面加载正常
- ✅ Agent 主动发起对话
- ✅ 提示询问业务信息
- ✅ 输入框可用

**测试数据:**
```
Q1: Annual Revenue?
A1: 500000

Q2: Net Profit?
A2: 75000

Q3: Industry?
A3: Restaurant

Q4: Years in Operation?
A4: 5

Q5: Asset Value?
A5: 50000

Q6: Growth Trend?
A6: stable

Q7: Risk Factors?
A7: Top 3 customers account for 40% of revenue
```

### 测试用例 1.2: 多轮对话状态

**测试步骤:**
1. 完成一轮完整对话
2. 检查对话历史是否保存
3. 滚动查看所有消息
4. 检查消息时间戳

**预期结果:**
- ✅ 所有消息正确显示
- ✅ 滚动平滑
- ✅ 消息格式正确（用户右对齐，AI左对齐）
- ✅ Agent头像显示

### 测试用例 1.3: Markdown渲染

**测试步骤:**
1. 让 Agent 生成包含 Markdown 的回复
2. 检查表格、列表、加粗等格式

**预期结果:**
- ✅ 表格正确渲染
- ✅ 列表项正确显示
- ✅ 加粗文本正确
- ✅ 标题层级正确

### 测试用例 1.4: 错误处理

**测试步骤:**
1. 断开网络连接
2. 尝试发送消息
3. 检查错误提示

**预期结果:**
- ✅ 显示友好的错误消息
- ✅ 不会崩溃
- ✅ 可以重试

---

## Task 2: 估值计算API测试 ✅

### 测试用例 2.1: 数据提取API

**API测试脚本:**

```bash
# 测试数据提取
curl -X POST http://localhost:3000/api/valuation/extract \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "My revenue is 500000 SGD"},
      {"role": "assistant", "content": "What is your net profit?"},
      {"role": "user", "content": "75000 SGD"},
      {"role": "assistant", "content": "What industry?"},
      {"role": "user", "content": "Restaurant, F&B"},
      {"role": "assistant", "content": "Years in operation?"},
      {"role": "user", "content": "5 years"},
      {"role": "assistant", "content": "Asset value?"},
      {"role": "user", "content": "50000"},
      {"role": "assistant", "content": "Growth trend?"},
      {"role": "user", "content": "Stable"}
    ]
  }'
```

**预期响应:**
```json
{
  "success": true,
  "data": {
    "annualRevenue": 500000,
    "netProfit": 75000,
    "ebitda": 75000,
    "industry": "fnb_retail",
    "yearsInOperation": 5,
    "assetValue": 50000,
    "growthTrend": "stable"
  }
}
```

### 测试用例 2.2: 估值计算API

**测试脚本:**

```bash
# 测试估值计算
curl -X POST http://localhost:3000/api/valuation/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "annualRevenue": 500000,
    "netProfit": 75000,
    "ebitda": 75000,
    "industry": "fnb_retail",
    "yearsInOperation": 5,
    "assetValue": 50000,
    "growthTrend": "stable",
    "businessName": "Test Restaurant",
    "contactEmail": "test@example.com"
  }'
```

**验证点:**
- ✅ Conservative < Fair Market < Optimistic
- ✅ 倍数在合理范围内（F&B: 1.5-3x EBITDA）
- ✅ 计算逻辑正确（30%/50%/20%权重）
- ✅ 响应时间 < 2秒

### 测试用例 2.3: 不同行业测试

**测试数据集:**

| 行业 | Revenue | EBITDA | 预期倍数范围 |
|------|---------|--------|------------|
| fnb_retail | 500K | 75K | 1.5-3x EBITDA |
| services | 300K | 90K | 2-4x EBITDA |
| tech_saas | 1M | 200K | 3-6x Revenue |
| education | 400K | 120K | 2-4x EBITDA |
| manufacturing | 800K | 200K | 3-5x + Assets |
| ecommerce | 600K | 150K | 2-4x EBITDA |
| healthcare | 700K | 210K | 3-5x EBITDA |

**执行每个行业的计算并验证:**
- ✅ 倍数在benchmark范围内
- ✅ 三档估值比例正确（0.85/1.0/1.15）
- ✅ 正面和风险因素合理

---

## Task 3: Airtable集成测试 ✅

### 测试用例 3.1: 保存功能

**测试步骤:**
1. 完成一次完整的估值计算
2. 点击 "Save" 按钮
3. 检查 Airtable Valuations 表

**验证点:**
- ✅ 记录成功创建
- ✅ 所有字段数据完整
- ✅ 时间戳正确
- ✅ 货币字段格式正确（SGD）

**Airtable检查清单:**
```
✅ Business Name
✅ Contact Email
✅ Annual Revenue (显示为 $500,000)
✅ Net Profit (显示为 $75,000)
✅ EBITDA (显示为 $75,000)
✅ Industry (显示为 fnb_retail)
✅ Years in Operation (显示为 5)
✅ Asset Value (显示为 $50,000)
✅ Growth Trend (显示为 stable)
✅ Conservative Valuation
✅ Fair Market Valuation
✅ Optimistic Valuation
✅ Weighted Average
✅ Risk Factors (文本)
✅ Positive Factors (文本)
✅ Recommendations (文本)
✅ Methods Used (JSON)
✅ Calculated At (日期时间)
✅ Created (自动生成)
```

### 测试用例 3.2: 历史查询

**测试步骤:**
1. 保存至少3条估值记录
2. 点击 "History" 按钮
3. 检查历史列表

**验证点:**
- ✅ 显示所有保存的记录
- ✅ 按时间倒序排列
- ✅ 记录信息完整
- ✅ Modal可以关闭

### 测试用例 3.3: 重复保存

**测试步骤:**
1. 完成估值
2. 多次点击 Save
3. 检查是否创建重复记录

**预期结果:**
- ✅ 每次点击都创建新记录（这是预期行为）
- 或 ✅ 提示已保存，防止重复

---

## Task 4: PDF导出测试 ✅

### 测试用例 4.1: PDF生成

**测试步骤:**
1. 完成估值计算
2. 点击 "Export PDF" 按钮
3. 检查新窗口

**验证点:**
- ✅ 新窗口成功打开
- ✅ HTML报告正确渲染
- ✅ 所有数据正确显示
- ✅ 格式专业美观

### 测试用例 4.2: 打印功能

**测试步骤:**
1. 在PDF窗口中使用 Cmd+P (Mac) / Ctrl+P (Windows)
2. 选择 "Save as PDF"
3. 保存并查看PDF文件

**验证点:**
- ✅ PDF正确生成
- ✅ 所有内容完整
- ✅ 分页合理
- ✅ 可以正常打开查看

### 测试用例 4.3: 浏览器兼容性

**测试浏览器:**
- ✅ Chrome
- ✅ Safari
- ✅ Firefox
- ✅ Edge

---

## Task 5: 错误处理测试 ✅

### 测试用例 5.1: API失败处理

**模拟场景:**
1. 无效的ANTHROPIC_API_KEY
2. 无效的AIRTABLE配置
3. 网络超时

**测试步骤:**
```bash
# 停止Airtable服务（临时修改.env.local）
# 或断开网络
```

**预期结果:**
- ✅ 显示友好错误消息
- ✅ 不暴露敏感信息
- ✅ 提供重试选项
- ✅ 应用不崩溃

### 测试用例 5.2: 无效输入

**测试数据:**
```json
{
  "annualRevenue": -1000,
  "netProfit": "not a number",
  "industry": "invalid_industry"
}
```

**预期结果:**
- ✅ API返回400错误
- ✅ 错误消息清晰
- ✅ 指出具体问题

### 测试用例 5.3: 空数据处理

**测试步骤:**
1. 开始对话但不回答任何问题
2. 直接点击 Calculate

**预期结果:**
- ✅ 提示需要完成对话
- ✅ 或提示数据不完整

---

## Task 6: UI/UX优化检查 ✅

### 6.1 响应式设计

**测试设备尺寸:**
- Desktop: 1920x1080
- Laptop: 1366x768
- Tablet: 768x1024
- Mobile: 375x667

**检查点:**
- ✅ 布局自适应
- ✅ 文字可读
- ✅ 按钮可点击
- ✅ 图片不变形

### 6.2 移动端体验

**测试步骤:**
1. 在手机上访问应用
2. 完成完整流程

**检查点:**
- ✅ 触摸目标足够大
- ✅ 滚动流畅
- ✅ 输入框体验好
- ✅ Modal适配移动端

### 6.3 加载状态

**检查所有加载状态:**
- ✅ 对话加载（Typing indicator）
- ✅ Calculate按钮（Processing...）
- ✅ Save按钮（Saving...）
- ✅ History加载

### 6.4 动画和过渡

**检查点:**
- ✅ 消息淡入动画
- ✅ 按钮hover效果
- ✅ Modal打开/关闭动画
- ✅ 打字指示器动画

---

## Task 7: 性能优化检查 ✅

### 7.1 页面加载速度

**测试工具:**
- Chrome DevTools Lighthouse
- PageSpeed Insights

**目标指标:**
- FCP (First Contentful Paint): < 1.5s
- LCP (Largest Contentful Paint): < 2.5s
- TTI (Time to Interactive): < 3.5s
- CLS (Cumulative Layout Shift): < 0.1

### 7.2 API响应时间

**测量:**
```bash
time curl -X POST http://localhost:3000/api/valuation/calculate -d '{...}'
```

**目标:**
- 数据提取: < 3s
- 估值计算: < 1s
- 保存: < 2s
- 历史查询: < 1s

### 7.3 Bundle大小

**检查:**
```bash
npm run build
```

**查看输出:**
- First Load JS: < 200KB
- 页面JS: < 50KB

---

## Task 8: 文档和代码清理 ✅

### 8.1 代码注释

**检查文件:**
- [ ] src/app/agents/[agentId]/page.tsx
- [ ] src/app/api/valuation/**/route.ts
- [ ] src/lib/airtable.ts

**标准:**
- 关键函数有注释
- 复杂逻辑有说明
- API端点有文档

### 8.2 README更新

**内容:**
- [ ] 项目简介
- [ ] 功能列表
- [ ] 安装步骤
- [ ] 配置说明
- [ ] 使用示例
- [ ] API文档
- [ ] 故障排查

### 8.3 清理未使用代码

**检查:**
- [ ] 删除console.log
- [ ] 删除注释掉的代码
- [ ] 删除未使用的import
- [ ] 删除未使用的文件

---

## 测试报告模板

```markdown
## 测试报告 - [日期]

### 测试环境
- OS: macOS / Windows / Linux
- Browser: Chrome 120
- Node: v20.x

### 测试结果

#### Task 1: 对话流程 ✅/❌
- [x] 基础对话
- [x] 多轮对话
- [ ] Markdown渲染 - Bug: 表格显示问题
- [x] 错误处理

#### Task 2: 估值计算 ✅/❌
- [x] 数据提取
- [x] 计算准确性
- [x] 不同行业

发现的问题:
1. [Bug描述]
2. [Bug描述]

建议改进:
1. [改进建议]
2. [改进建议]
```

---

## 快速测试脚本

创建快速测试脚本：

```bash
#!/bin/bash
# test-valuation.sh

echo "🧪 Starting Valuation Agent Tests..."

# 1. 测试数据提取
echo "Test 1: Data Extraction"
curl -s -X POST http://localhost:3000/api/valuation/extract \
  -H "Content-Type: application/json" \
  -d @test-data/extract-payload.json | jq

# 2. 测试估值计算
echo "Test 2: Valuation Calculation"
curl -s -X POST http://localhost:3000/api/valuation/calculate \
  -H "Content-Type: application/json" \
  -d @test-data/calculate-payload.json | jq

# 3. 测试历史查询
echo "Test 3: History Query"
curl -s http://localhost:3000/api/valuation/history | jq

echo "✅ Tests completed!"
```

---

需要开始某个具体的测试任务吗？我可以帮你执行测试或修复发现的问题。
