import Airtable from "airtable";
import {
  BusinessListing,
  AirtableListingRecord,
  BuyerLead,
  AirtableLeadRecord,
} from "@/types";

// ✅ 懒加载初始化 - 避免 build 时因缺少环境变量报错
const getAirtable = () => {
  return new Airtable({ apiKey: process.env.AIRTABLE_API_KEY! });
};

const getBase = () => {
  return getAirtable().base(process.env.AIRTABLE_BASE_ID!);
};

// Listings 表操作
export async function createListing(
  listing: BusinessListing
): Promise<string> {
  const base = getBase();
  const record = await base("Listings").create({
    "Business Name": listing.businessName,
    Industry: listing.industry,
    Description: listing.description,
    Location: listing.location,
    "Years in Operation": listing.yearsInOperation,
    "Annual Revenue (SGD)": listing.annualRevenue,
    "Net Profit (SGD)": listing.netProfit,
    "Asking Price (SGD)": listing.askingPrice,
    Employees: listing.employees,
    "Reason for Selling": listing.reasonForSelling,
    "Key Assets": listing.keyAssets,
    "Seller Name": listing.sellerName,
    "Seller Email": listing.sellerEmail,
    "Seller Phone": listing.sellerPhone,
    "AI Summary": listing.aiSummary || "",
    "Valuation Low": listing.valuationLow || 0,
    "Valuation Mid": listing.valuationMid || 0,
    "Valuation High": listing.valuationHigh || 0,
    Status: "Pending Review",
  });

  return record.id;
}

export async function getListings(
  status?: string
): Promise<AirtableListingRecord[]> {
  const base = getBase();
  const listings: AirtableListingRecord[] = [];

  let filterFormula = "";
  if (status) {
    const statuses = status.split("+").map((s) => s.trim());
    if (statuses.length === 1) {
      filterFormula = `{Status} = '${statuses[0]}'`;
    } else {
      filterFormula = `OR(${statuses.map((s) => `{Status} = '${s}'`).join(", ")})`;
    }
  } else {
    // Default: exclude Withdrawn
    filterFormula = `{Status} != 'Withdrawn'`;
  }

  const records = await base("Listings")
    .select({
      filterByFormula: filterFormula,
      sort: [{ field: "Created", direction: "desc" }],
    })
    .all();

  records.forEach((record) => {
    listings.push({
      id: record.id,
      businessName: record.get("Business Name") as string,
      industry: record.get("Industry") as string,
      description: record.get("Description") as string,
      location: record.get("Location") as string,
      yearsInOperation: record.get("Years in Operation") as number,
      annualRevenue: record.get("Annual Revenue (SGD)") as number,
      netProfit: record.get("Net Profit (SGD)") as number,
      askingPrice: record.get("Asking Price (SGD)") as number,
      employees: record.get("Employees") as number,
      reasonForSelling: record.get("Reason for Selling") as string,
      keyAssets: record.get("Key Assets") as string,
      sellerName: record.get("Seller Name") as string,
      sellerEmail: record.get("Seller Email") as string,
      sellerPhone: record.get("Seller Phone") as string,
      aiSummary: record.get("AI Summary") as string,
      valuationLow: record.get("Valuation Low") as number,
      valuationMid: record.get("Valuation Mid") as number,
      valuationHigh: record.get("Valuation High") as number,
      status: record.get("Status") as any,
      created: record.get("Created") as string,
    });
  });

  return listings;
}

export async function updateListingStatus(
  recordId: string,
  status: string
): Promise<void> {
  const base = getBase();
  await base("Listings").update(recordId, {
    Status: status,
  });
}

// Leads 表操作
export async function createLead(lead: BuyerLead): Promise<string> {
  const base = getBase();
  const record = await base("Leads").create({
    Name: lead.name,
    Email: lead.email,
    Phone: lead.phone,
    "Budget (SGD)": lead.budget,
    "Funding Source": lead.fundingSource,
    "Preferred Industries": lead.preferredIndustries,
    "Preferred Location": lead.preferredLocation,
    Timeline: lead.timeline,
    "Has Business Experience": lead.hasBusinessExperience,
    "ROI Expectation (%)": lead.roiExpectation,
    "Lead Score": lead.leadScore,
    Tier: lead.tier,
    "Score Breakdown": lead.scoreBreakdown,
    "Chat Summary": lead.chatSummary || "",
    Status: "New",
  });

  return record.id;
}

export async function getLeads(tier?: string): Promise<AirtableLeadRecord[]> {
  const base = getBase();
  const leads: AirtableLeadRecord[] = [];

  let filterFormula = "";
  if (tier) {
    const tierMap: Record<string, string> = {
      hot: "🔥 Hot",
      warm: "🌡️ Warm",
      cold: "❄️ Cold",
    };
    filterFormula = `{Tier} = '${tierMap[tier.toLowerCase()] || tier}'`;
  }

  const records = await base("Leads")
    .select({
      ...(filterFormula && { filterByFormula: filterFormula }),
      sort: [{ field: "Lead Score", direction: "desc" }],
    })
    .all();

  records.forEach((record) => {
    leads.push({
      id: record.id,
      name: record.get("Name") as string,
      email: record.get("Email") as string,
      phone: record.get("Phone") as string,
      budget: record.get("Budget (SGD)") as number,
      fundingSource: record.get("Funding Source") as string,
      preferredIndustries: record.get("Preferred Industries") as string,
      preferredLocation: record.get("Preferred Location") as string,
      timeline: record.get("Timeline") as string,
      hasBusinessExperience: record.get("Has Business Experience") as boolean,
      roiExpectation: record.get("ROI Expectation (%)") as number,
      leadScore: record.get("Lead Score") as number,
      tier: record.get("Tier") as any,
      scoreBreakdown: record.get("Score Breakdown") as string,
      chatSummary: record.get("Chat Summary") as string,
      status: record.get("Status") as any,
      created: record.get("Created") as string,
    });
  });

  return leads;
}

export async function updateLeadStatus(
  recordId: string,
  status: string
): Promise<void> {
  const base = getBase();
  await base("Leads").update(recordId, {
    Status: status,
  });
}
