import { NextRequest, NextResponse } from "next/server";
import type {
  ValuationInput,
  ValuationResult,
  ValuationMethodResult,
  IndustryType,
} from "@/types";

export const dynamic = "force-dynamic";

// Industry benchmarks
const INDUSTRY_BENCHMARKS: Record<
  IndustryType,
  {
    name: string;
    revenueMultiplier?: { min: number; max: number };
    ebitdaMultiplier?: { min: number; max: number };
    includeAssets?: boolean;
  }
> = {
  fnb_retail: {
    name: "F&B/Retail",
    revenueMultiplier: { min: 0.3, max: 0.6 },
    ebitdaMultiplier: { min: 1.5, max: 3 },
  },
  services: {
    name: "Services/Consulting",
    ebitdaMultiplier: { min: 2, max: 4 },
  },
  tech_saas: {
    name: "Tech/SaaS",
    revenueMultiplier: { min: 3, max: 6 },
  },
  education: {
    name: "Education/Tuition",
    ebitdaMultiplier: { min: 2, max: 4 },
  },
  manufacturing: {
    name: "Manufacturing",
    ebitdaMultiplier: { min: 3, max: 5 },
    includeAssets: true,
  },
  ecommerce: {
    name: "E-commerce",
    revenueMultiplier: { min: 0.5, max: 1.5 },
    ebitdaMultiplier: { min: 2, max: 4 },
  },
  healthcare: {
    name: "Healthcare/Clinic",
    ebitdaMultiplier: { min: 3, max: 5 },
  },
};

function calculateValuation(input: ValuationInput): ValuationResult {
  const benchmark = INDUSTRY_BENCHMARKS[input.industry];
  const methods: ValuationMethodResult[] = [];

  // Revenue Multiple Method (30% weight)
  if (benchmark.revenueMultiplier) {
    const avgMultiplier =
      Math.round(((benchmark.revenueMultiplier.min + benchmark.revenueMultiplier.max) / 2) * 100) / 100;
    methods.push({
      method: `Revenue Multiple (${avgMultiplier.toFixed(1)}x)`,
      value: input.annualRevenue * avgMultiplier,
      multiplier: avgMultiplier,
      weight: 0.3,
    });
  }

  // EBITDA Multiple Method (50% weight)
  if (benchmark.ebitdaMultiplier) {
    const avgMultiplier =
      Math.round(((benchmark.ebitdaMultiplier.min + benchmark.ebitdaMultiplier.max) / 2) * 100) / 100;
    const ebitda = input.ebitda || input.netProfit;
    methods.push({
      method: `EBITDA Multiple (${avgMultiplier.toFixed(1)}x)`,
      value: ebitda * avgMultiplier,
      multiplier: avgMultiplier,
      weight: 0.5,
    });
  }

  // Asset-Based Method (20% weight)
  methods.push({
    method: "Asset-Based",
    value: input.assetValue,
    multiplier: 1,
    weight: 0.2,
  });

  // Calculate weighted average
  let weightedAverage = 0;
  let totalWeight = 0;

  methods.forEach((method) => {
    weightedAverage += method.value * method.weight;
    totalWeight += method.weight;
  });

  // Normalize if weights don't add up to 1
  if (totalWeight !== 1) {
    weightedAverage = weightedAverage / totalWeight;
  }

  // Calculate conservative, fair market, and optimistic
  const conservative = weightedAverage * 0.85;
  const fairMarket = weightedAverage;
  const optimistic = weightedAverage * 1.15;

  // Generate positive factors
  const positiveFactors: string[] = [];
  if (input.yearsInOperation >= 5) {
    positiveFactors.push("Established business with proven track record");
  }
  if (input.growthTrend === "growing") {
    positiveFactors.push("Positive growth trajectory");
  }
  if (input.netProfit / input.annualRevenue > 0.15) {
    positiveFactors.push("Strong profit margins (>15%)");
  }
  if (input.assetValue > input.annualRevenue * 0.5) {
    positiveFactors.push("Significant tangible assets");
  }

  // Generate risk factors
  const riskFactors: string[] = [];
  if (input.yearsInOperation < 3) {
    riskFactors.push("Relatively new business (<3 years)");
  }
  if (input.growthTrend === "declining") {
    riskFactors.push("Declining revenue trend");
  }
  if (input.netProfit / input.annualRevenue < 0.1) {
    riskFactors.push("Low profit margins (<10%)");
  }
  if (input.riskFactors && input.riskFactors.length > 0) {
    riskFactors.push(...input.riskFactors);
  }

  // Generate recommendations
  let recommendations = "";
  if (fairMarket > 0) {
    const revenueMultiple = fairMarket / input.annualRevenue;
    recommendations = `Based on the ${benchmark.name} industry benchmarks and your business metrics, a fair asking price would be around SGD ${fairMarket.toLocaleString(
      "en-SG",
      { maximumFractionDigits: 0 }
    )} (${revenueMultiple.toFixed(
      1
    )}x annual revenue). Consider starting negotiations at the optimistic range and being prepared to settle around the fair market value.`;
  }

  return {
    input,
    methods,
    conservative,
    fairMarket,
    optimistic,
    weightedAverage,
    positiveFactors,
    riskFactors,
    recommendations,
    calculatedAt: new Date().toISOString(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const input: ValuationInput = await request.json();

    // Validate required fields
    if (
      !input.annualRevenue ||
      !input.netProfit ||
      !input.industry ||
      !input.yearsInOperation
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Validate industry
    const validIndustries: IndustryType[] = [
      "fnb_retail",
      "services",
      "tech_saas",
      "education",
      "manufacturing",
      "ecommerce",
      "healthcare",
    ];

    if (!validIndustries.includes(input.industry)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid industry type",
          details: `Industry must be one of: ${validIndustries.join(", ")}`,
          received: input.industry,
        },
        { status: 400 }
      );
    }

    // Validate numeric values
    const validationErrors: Array<{
      field: string;
      value: number;
      constraint: string;
    }> = [];

    if (input.annualRevenue <= 0) {
      validationErrors.push({
        field: "annualRevenue",
        value: input.annualRevenue,
        constraint: "must be greater than 0",
      });
    }

    if (input.netProfit < 0) {
      validationErrors.push({
        field: "netProfit",
        value: input.netProfit,
        constraint: "must be greater than or equal to 0",
      });
    }

    if (input.yearsInOperation < 0) {
      validationErrors.push({
        field: "yearsInOperation",
        value: input.yearsInOperation,
        constraint: "must be greater than or equal to 0",
      });
    }

    if (input.assetValue !== undefined && input.assetValue < 0) {
      validationErrors.push({
        field: "assetValue",
        value: input.assetValue,
        constraint: "must be greater than or equal to 0",
      });
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input values",
          validation_errors: validationErrors,
        },
        { status: 400 }
      );
    }

    // Use netProfit as EBITDA if not provided
    if (!input.ebitda) {
      input.ebitda = input.netProfit;
    }

    // Default assetValue if not provided
    if (!input.assetValue) {
      input.assetValue = 0;
    }

    const result = calculateValuation(input);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Valuation calculation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to calculate valuation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
