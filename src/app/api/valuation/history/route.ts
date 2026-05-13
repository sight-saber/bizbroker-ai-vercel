import { NextRequest, NextResponse } from "next/server";
import { getValuations } from "@/lib/airtable";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || undefined;

    // Fetch valuations from Airtable
    const valuations = await getValuations(email);

    const response = NextResponse.json({
      success: true,
      data: {
        valuations,
        count: valuations.length,
      },
    });

    // Cache for 5 minutes for better performance
    response.headers.set(
      "Cache-Control",
      "private, max-age=300, stale-while-revalidate=600"
    );

    return response;
  } catch (error) {
    console.error("Valuation history error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch valuation history",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
