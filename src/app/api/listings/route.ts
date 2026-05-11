import { NextRequest, NextResponse } from "next/server";
import { createListing, getListings } from "@/lib/airtable";
import {
  sendListingNotificationToAdmin,
  sendListingConfirmationToSeller,
} from "@/lib/email";
import type { BusinessListing, ListingResponse } from "@/types";

export const dynamic = "force-dynamic";

// POST - Create new listing
export async function POST(request: NextRequest) {
  try {
    const listing: BusinessListing = await request.json();

    // Validate required fields
    if (
      !listing.businessName ||
      !listing.industry ||
      !listing.sellerEmail
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to Airtable
    const recordId = await createListing(listing);

    // Send emails (fire-and-forget)
    sendListingNotificationToAdmin(listing, recordId).catch(console.error);
    sendListingConfirmationToSeller(listing).catch(console.error);

    const result: ListingResponse = {
      success: true,
      recordId,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create listing",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET - Fetch listings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;

    const listings = await getListings(status);

    return NextResponse.json({ success: true, listings });
  } catch (error) {
    console.error("Get listings error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch listings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
