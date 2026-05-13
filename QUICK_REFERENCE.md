# 🚀 快速参考 - Valuation Agent

**一页纸参考指南**

---

## 📊 标准输入模板

```json
{
  "businessName": "企业名称",
  "industry": "fnb_retail",
  "annualRevenue": 1200000,
  "netProfit": 180000,
  "yearsInOperation": 3,
  "assetValue": 150000,
  "growthTrend": "growing"
}
```

---

## 🏢 行业代码

| 代码 | 名称 | 营收乘数 | EBITDA乘数 |
|------|------|----------|------------|
| `fnb_retail` | 餐饮/零售 | 0.3-0.6x | 1.5-3.0x |
| `services` | 服务/咨询 | - | 2.0-4.0x |
| `tech_saas` | 科技/SaaS | 3.0-6.0x | - |
| `education` | 教育/培训 | - | 2.0-4.0x |
| `manufacturing` | 制造业 | - | 3.0-5.0x |
| `ecommerce` | 电商 | 0.5-1.5x | 2.0-4.0x |
| `healthcare` | 医疗/诊所 | - | 3.0-5.0x |

---

## 📈 增长趋势

- `growing` - 增长 >10%
- `stable` - 波动 ±10%
- `declining` - 下降 >10%

---

## 🧮 估值公式

```
加权平均 = (营收乘数 × 30%) + (EBITDA乘数 × 50%) + (资产价值 × 20%)

保守估值 = 加权平均 × 0.85
公允估值 = 加权平均 × 1.00
乐观估值 = 加权平均 × 1.15
```

---

## 🔌 API 端点

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/valuation/extract` | POST | 从对话提取数据 |
| `/api/valuation/calculate` | POST | 计算估值 |
| `/api/valuation/save` | POST | 保存到Airtable |
| `/api/valuation/history` | GET | 查询历史 |
| `/api/valuation/export-pdf` | POST | 导出PDF |

---

## 💻 快速测试

```bash
# 1. 启动开发服务器
npm run dev

# 2. 运行测试脚本
./scripts/test-valuation.sh

# 3. 手动测试
curl -X POST http://localhost:3000/api/valuation/calculate \
  -H "Content-Type: application/json" \
  -d @test-data/calculate-payload.json
```

---

## 📝 示例：餐饮店

**输入:**
- 名称: 小龙坎火锅店
- 行业: fnb_retail
- 营收: $1,200,000
- 利润: $180,000
- 年限: 3年
- 资产: $150,000
- 趋势: growing

**输出:**
- 保守: $396,562
- 公允: $466,500
- 乐观: $536,438

---

## 📝 示例：科技公司

**输入:**
- 名称: CloudSync SaaS
- 行业: tech_saas
- 营收: $500,000
- 利润: $100,000
- 年限: 2年
- 资产: $50,000
- 趋势: growing

**输出:**
- 保守: $1,164,500
- 公允: $1,370,000
- 乐观: $1,575,500

---

## 🎯 关键要点

1. **所有金额使用新币 (SGD)**
2. **年营业额 = 全年总收入**
3. **净利润 = 税后利润**
4. **资产价值 = 有形资产市场价**
5. **估值仅供参考，非最终交易价**

---

## ⚡ 命令速查

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm start                # 运行生产版本

# 测试
./scripts/test-valuation.sh     # 快速测试
npm run setup:airtable          # 设置Airtable

# 部署
vercel --prod            # 部署到生产环境
```

---

## 📚 完整文档

- [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) - 详细使用示例
- [QUICK_START.md](./QUICK_START.md) - 快速入门
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - 部署指南
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - 测试指南

---

## 🆘 常见问题

**Q: 如何选择行业？**
A: 选择最接近的行业类型。如不确定，选择 `services`

**Q: EBITDA 和净利润有什么区别？**
A: 如果不确定，可以使用净利润代替 EBITDA

**Q: 估值结果可靠吗？**
A: 估值基于行业基准，仅供参考。实际价格需专业评估

**Q: 可以用于非新加坡企业吗？**
A: 可以，但行业乘数基于新加坡市场

**Q: 如何保存估值记录？**
A: 点击"💾 Save"按钮自动保存到 Airtable

---

**Built for Singapore SMEs** 🇸🇬
