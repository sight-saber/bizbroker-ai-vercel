import { NextRequest, NextResponse } from "next/server";
import { createLead, getLeads } from "@/lib/airtable";
import { sendLeadNotificationToAdmin } from "@/lib/email";
import type { BuyerLead, LeadResponse } from "@/types";

export const dynamic = "force-dynamic";

// POST - Create new lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead, chatSummary }: { lead: BuyerLead; chatSummary?: string } =
      body;

    // Validate required fields
    if (!lead.name || !lead.email || !lead.leadScore) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Add chat summary if provided
    if (chatSummary) {
      lead.chatSummary = chatSummary;
    }

    // Save to Airtable
    const recordId = await createLead(lead);

    // Send email notification (fire-and-forget)
    sendLeadNotificationToAdmin(lead, recordId).catch(console.error);

    // Determine tier for response
    const tier = lead.tier.includes("Hot")
      ? "hot"
      : lead.tier.includes("Warm")
        ? "warm"
        : "cold";

    const result: LeadResponse = {
      success: true,
      recordId,
      tier,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Create lead error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create lead",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET - Fetch leads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tier = searchParams.get("tier") || undefined;

    const leads = await getLeads(tier);

    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error("Get leads error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch leads",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
