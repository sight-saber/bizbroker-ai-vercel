#!/bin/bash

# 估值计算测试脚本
# 使用方法: ./scripts/test-valuation.sh

echo "🧪 Valuation Agent - 快速测试"
echo "================================"
echo ""

BASE_URL="http://localhost:3000"

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试1: 餐饮店估值
echo -e "${BLUE}测试 1: 餐饮店估值${NC}"
echo "企业: 小龙坎火锅店"
echo "行业: 餐饮/零售"
echo "营收: SGD 1,200,000"
echo "利润: SGD 180,000"
echo ""

RESPONSE=$(curl -s -X POST "$BASE_URL/api/valuation/calculate" \
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
  }')

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ 测试通过${NC}"
  echo ""
  echo "估值结果:"
  echo "$RESPONSE" | python3 -m json.tool | grep -A 5 '"conservative"'
else
  echo -e "${YELLOW}✗ 测试失败${NC}"
  echo "$RESPONSE"
fi

echo ""
echo "================================"
echo ""

# 测试2: 科技公司估值
echo -e "${BLUE}测试 2: 科技公司估值${NC}"
echo "企业: CloudSync SaaS"
echo "行业: Tech/SaaS"
echo "营收: SGD 500,000"
echo "利润: SGD 100,000"
echo ""

RESPONSE=$(curl -s -X POST "$BASE_URL/api/valuation/calculate" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "CloudSync SaaS",
    "industry": "tech_saas",
    "annualRevenue": 500000,
    "netProfit": 100000,
    "ebitda": 120000,
    "yearsInOperation": 2,
    "assetValue": 50000,
    "growthTrend": "growing"
  }')

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ 测试通过${NC}"
  echo ""
  echo "估值结果:"
  echo "$RESPONSE" | python3 -m json.tool | grep -A 5 '"conservative"'
else
  echo -e "${YELLOW}✗ 测试失败${NC}"
  echo "$RESPONSE"
fi

echo ""
echo "================================"
echo ""

# 测试3: 教育机构估值
echo -e "${BLUE}测试 3: 教育机构估值${NC}"
echo "企业: 优学教育中心"
echo "行业: 教育/培训"
echo "营收: SGD 800,000"
echo "利润: SGD 200,000"
echo ""

RESPONSE=$(curl -s -X POST "$BASE_URL/api/valuation/calculate" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "优学教育中心",
    "industry": "education",
    "annualRevenue": 800000,
    "netProfit": 200000,
    "ebitda": 200000,
    "yearsInOperation": 6,
    "assetValue": 100000,
    "growthTrend": "stable"
  }')

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}✓ 测试通过${NC}"
  echo ""
  echo "估值结果:"
  echo "$RESPONSE" | python3 -m json.tool | grep -A 5 '"conservative"'
else
  echo -e "${YELLOW}✗ 测试失败${NC}"
  echo "$RESPONSE"
fi

echo ""
echo "================================"
echo ""
echo -e "${GREEN}测试完成！${NC}"
echo ""
echo "查看完整响应，请运行："
echo "curl -X POST $BASE_URL/api/valuation/calculate -H 'Content-Type: application/json' -d '{...}' | python3 -m json.tool"
