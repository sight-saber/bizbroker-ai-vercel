"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { AirtableListingRecord, AirtableLeadRecord } from "@/types";

export default function DashboardPage() {
  const [listings, setListings] = useState<AirtableListingRecord[]>([]);
  const [leads, setLeads] = useState<AirtableLeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"listings" | "leads">("listings");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [listingsRes, leadsRes] = await Promise.all([
        fetch("/api/listings"),
        fetch("/api/leads"),
      ]);

      const listingsData = await listingsRes.json();
      const leadsData = await leadsRes.json();

      if (listingsData.success) setListings(listingsData.listings);
      if (leadsData.success) setLeads(leadsData.leads);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "#00D4AA";
      case "Pending Review":
        return "#FFB84D";
      case "Sold":
        return "#845EF7";
      default:
        return "#666";
    }
  };

  const getTierColor = (tier: string) => {
    if (tier.includes("Hot")) return "#FF6B35";
    if (tier.includes("Warm")) return "#FFB84D";
    return "#20C997";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold mb-1">
                Admin Dashboard
              </h1>
              <p className="text-sm text-white/50">
                Manage listings and leads
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm rounded-lg border border-white/15 bg-white/8 hover:bg-white/12 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="text-white/50 text-sm mb-1">Total Listings</div>
            <div className="text-3xl font-bold">{listings.length}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="text-white/50 text-sm mb-1">Active Listings</div>
            <div className="text-3xl font-bold">
              {listings.filter((l) => l.status === "Active").length}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="text-white/50 text-sm mb-1">Total Leads</div>
            <div className="text-3xl font-bold">{leads.length}</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="text-white/50 text-sm mb-1">Hot Leads 🔥</div>
            <div className="text-3xl font-bold">
              {leads.filter((l) => l.tier.includes("Hot")).length}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("listings")}
            className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
              activeTab === "listings"
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            📋 Listings ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
              activeTab === "leads"
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            ⭐ Leads ({leads.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full mx-auto mb-4" />
            <p className="text-white/50">Loading data...</p>
          </div>
        ) : (
          <>
            {/* Listings Table */}
            {activeTab === "listings" && (
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-semibold">
                          Business
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold">
                          Industry
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold">
                          Location
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold">
                          Revenue
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold">
                          Price
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold">
                          Status
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold">
                          Seller
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.map((listing) => (
                        <tr
                          key={listing.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="px-4 py-4">
                            <div className="font-semibold">
                              {listing.businessName}
                            </div>
                            <div className="text-xs text-white/50">
                              {listing.yearsInOperation} years
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {listing.industry}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {listing.location}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            SGD {listing.annualRevenue.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold">
                            SGD {listing.askingPrice.toLocaleString()}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className="px-2 py-1 rounded-md text-xs font-semibold"
                              style={{
                                background: `${getStatusColor(listing.status)}22`,
                                color: getStatusColor(listing.status),
                              }}
                            >
                              {listing.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <div>{listing.sellerName}</div>
                            <div className="text-xs text-white/50">
                              {listing.sellerEmail}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Leads Table */}
            {activeTab === "leads" && (
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-semibold">
                          Score
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold">
                          Name
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold">
                          Budget
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold">
                          Industries
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold">
                          Timeline
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold">
                          Tier
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr
                          key={lead.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="px-4 py-4">
                            <div className="text-2xl font-bold">
                              {lead.leadScore}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-semibold">{lead.name}</div>
                            <div className="text-xs text-white/50">
                              {lead.email}
                            </div>
                            <div className="text-xs text-white/50">
                              {lead.phone}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            SGD {lead.budget.toLocaleString()}
                            <div className="text-xs text-white/50">
                              {lead.fundingSource}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {lead.preferredIndustries}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {lead.timeline}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className="px-2 py-1 rounded-md text-xs font-semibold"
                              style={{
                                background: `${getTierColor(lead.tier)}22`,
                                color: getTierColor(lead.tier),
                              }}
                            >
                              {lead.tier}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm">{lead.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
