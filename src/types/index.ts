// Agent Types
export type AgentId = "onboarding" | "valuation" | "matching" | "diligence" | "qualification";

export interface Agent {
  id: AgentId;
  name: string;
  icon: string;
  color: string;
  description: string;
  systemPrompt: string;
}

// Chat Types
export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  agentId: AgentId;
  messages: Message[];
  sessionId?: string;
}

export interface ChatResponse {
  message: string;
  sessionId: string;
}

// Business Listing Types
export interface BusinessListing {
  businessName: string;
  industry: string;
  description: string;
  location: string;
  yearsInOperation: number;
  annualRevenue: number;
  netProfit: number;
  askingPrice: number;
  employees: number;
  reasonForSelling: string;
  keyAssets: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  aiSummary?: string;
  valuationLow?: number;
  valuationMid?: number;
  valuationHigh?: number;
}

export interface AirtableListingRecord extends BusinessListing {
  id: string;
  status: "Pending Review" | "Active" | "Sold" | "Withdrawn";
  created: string;
}

// Buyer Lead Types
export interface BuyerLead {
  name: string;
  email: string;
  phone: string;
  budget: number;
  fundingSource: string;
  preferredIndustries: string;
  preferredLocation: string;
  timeline: string;
  hasBusinessExperience: boolean;
  roiExpectation: number;
  leadScore: number;
  tier: "🔥 Hot" | "🌡️ Warm" | "❄️ Cold";
  scoreBreakdown: string;
  chatSummary?: string;
}

export interface AirtableLeadRecord extends BuyerLead {
  id: string;
  status: "New" | "Contacted" | "Qualified" | "Nurturing" | "Converted";
  created: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ListingResponse {
  success: boolean;
  recordId: string;
}

export interface LeadResponse {
  success: boolean;
  recordId: string;
  tier: "hot" | "warm" | "cold";
}
