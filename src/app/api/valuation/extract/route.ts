import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { Message, ValuationInput } from "@/types";

export const dynamic = "force-dynamic";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const EXTRACTION_PROMPT = `You are a data extraction specialist. Extract structured valuation data from the conversation.

Analyze the conversation and extract the following information in JSON format:

{
  "annualRevenue": <number in SGD>,
  "netProfit": <number in SGD>,
  "ebitda": <number in SGD, same as netProfit if not specified>,
  "industry": "<one of: fnb_retail, services, tech_saas, education, manufacturing, ecommerce, healthcare>",
  "yearsInOperation": <number>,
  "assetValue": <number in SGD, 0 if not mentioned>,
  "growthTrend": "<one of: growing, stable, declining>",
  "customerConcentration": "<description if mentioned>",
  "riskFactors": [<array of risk factor strings>],
  "businessName": "<name if mentioned>",
  "contactEmail": "<email if mentioned>"
}

Industry mapping guide:
- F&B, Restaurant, Retail, Shop → "fnb_retail"
- Consulting, Services, Agency → "services"
- Tech, SaaS, Software, IT → "tech_saas"
- Education, Tuition, Training → "education"
- Manufacturing, Factory, Production → "manufacturing"
- E-commerce, Online Store → "ecommerce"
- Healthcare, Clinic, Medical → "healthcare"

Growth trend mapping:
- Increasing, expanding, up → "growing"
- Flat, steady, same → "stable"
- Decreasing, down, losing → "declining"

Rules:
1. Only extract data that was explicitly mentioned in the conversation
2. Use 0 or empty values for missing optional fields
3. Return ONLY the JSON object, no additional text
4. All monetary values should be numbers without currency symbols
5. If a field cannot be determined, use null

Example output:
{
  "annualRevenue": 500000,
  "netProfit": 75000,
  "ebitda": 75000,
  "industry": "fnb_retail",
  "yearsInOperation": 5,
  "assetValue": 50000,
  "growthTrend": "stable",
  "riskFactors": ["High customer concentration"],
  "businessName": "Cafe ABC",
  "contactEmail": "owner@example.com"
}`;

export async function POST(request: NextRequest) {
  try {
    const body: { messages: Message[] } = await request.json();
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No messages provided",
        },
        { status: 400 }
      );
    }

    // Build conversation context
    const conversationText = messages
      .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n\n");

    // Call Claude to extract structured data
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: EXTRACTION_PROMPT,
      messages: [
        {
          role: "user",
          content: `Extract valuation data from this conversation:\n\n${conversationText}`,
        },
      ],
    });

    const extractedText =
      response.content[0].type === "text"
        ? response.content[0].text
        : null;

    if (!extractedText) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to extract data",
        },
        { status: 500 }
      );
    }

    // Parse JSON from response
    let extractedData: Partial<ValuationInput>;
    try {
      // Remove markdown code blocks if present
      const jsonText = extractedText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      extractedData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to parse extracted data",
          details: extractedText,
        },
        { status: 500 }
      );
    }

    // Validate required fields
    const requiredFields = ["annualRevenue", "netProfit", "industry", "yearsInOperation"];
    const missingFields = requiredFields.filter(
      (field) => !extractedData[field as keyof ValuationInput]
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Incomplete data extracted",
          missingFields,
          extractedData,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: extractedData,
    });
  } catch (error) {
    console.error("Data extraction error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to extract valuation data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
