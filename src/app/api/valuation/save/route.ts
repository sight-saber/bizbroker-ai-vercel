import { NextRequest, NextResponse } from "next/server";
import { createValuation } from "@/lib/airtable";
import type { ValuationResult } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const valuation: ValuationResult = await request.json();

    // Validate required fields
    if (!valuation.input || !valuation.fairMarket) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid valuation data",
        },
        { status: 400 }
      );
    }

    // Save to Airtable
    const recordId = await createValuation(valuation);

    return NextResponse.json({
      success: true,
      data: {
        recordId,
        message: "Valuation saved successfully",
      },
    });
  } catch (error) {
    console.error("Valuation save error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save valuation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
