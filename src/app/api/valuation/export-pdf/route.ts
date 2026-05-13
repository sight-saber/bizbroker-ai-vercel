import { NextRequest, NextResponse } from "next/server";
import type { ValuationResult } from "@/types";

export const dynamic = "force-dynamic";

function generatePDFHTML(valuation: ValuationResult): string {
  const industryNames: Record<string, string> = {
    fnb_retail: "F&B/Retail",
    services: "Services/Consulting",
    tech_saas: "Tech/SaaS",
    education: "Education/Tuition",
    manufacturing: "Manufacturing",
    ecommerce: "E-commerce",
    healthcare: "Healthcare/Clinic",
  };

  const date = new Date(valuation.calculatedAt).toLocaleDateString("en-SG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Business Valuation Report - ${valuation.input.businessName || "Confidential"}</title>
  <style>
    @media print {
      @page { margin: 1.5cm; }
      body { margin: 0; }
    }

    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #fff;
    }

    .header {
      border-bottom: 4px solid #FF6B35;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .header h1 {
      margin: 0;
      font-size: 32px;
      color: #FF6B35;
    }

    .header .subtitle {
      color: #666;
      font-size: 14px;
      margin-top: 5px;
    }

    .section {
      margin: 30px 0;
    }

    .section h2 {
      font-size: 20px;
      color: #333;
      border-bottom: 2px solid #eee;
      padding-bottom: 8px;
      margin-bottom: 15px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }

    th, td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid #eee;
    }

    th {
      background: #f8f8f8;
      font-weight: 600;
      color: #333;
    }

    .valuation-range {
      background: #f8f8f8;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .valuation-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #ddd;
    }

    .valuation-item:last-child {
      border-bottom: none;
    }

    .valuation-label {
      font-weight: 600;
      color: #555;
    }

    .valuation-value {
      font-size: 20px;
      font-weight: 700;
      color: #FF6B35;
    }

    .factors {
      margin: 15px 0;
    }

    .factor-list {
      margin: 10px 0;
      padding-left: 20px;
    }

    .factor-list li {
      margin: 8px 0;
      color: #555;
    }

    .positive { color: #28a745; }
    .negative { color: #dc3545; }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #eee;
      text-align: center;
      color: #888;
      font-size: 12px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 15px 0;
    }

    .info-item {
      padding: 10px;
      background: #f8f8f8;
      border-radius: 4px;
    }

    .info-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 5px;
    }

    .info-value {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 Business Valuation Report</h1>
    <div class="subtitle">Confidential Analysis • Generated on ${date}</div>
  </div>

  <div class="section">
    <h2>Business Information</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Business Name</div>
        <div class="info-value">${valuation.input.businessName || "Confidential"}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Industry</div>
        <div class="info-value">${industryNames[valuation.input.industry] || valuation.input.industry}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Years in Operation</div>
        <div class="info-value">${valuation.input.yearsInOperation} years</div>
      </div>
      <div class="info-item">
        <div class="info-label">Growth Trend</div>
        <div class="info-value">${valuation.input.growthTrend}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Financial Metrics</h2>
    <table>
      <thead>
        <tr>
          <th>Metric</th>
          <th style="text-align: right;">Amount (SGD)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Annual Revenue</td>
          <td style="text-align: right;">$${valuation.input.annualRevenue.toLocaleString()}</td>
        </tr>
        <tr>
          <td>Net Profit</td>
          <td style="text-align: right;">$${valuation.input.netProfit.toLocaleString()}</td>
        </tr>
        <tr>
          <td>EBITDA</td>
          <td style="text-align: right;">$${valuation.input.ebitda.toLocaleString()}</td>
        </tr>
        <tr>
          <td>Asset Value</td>
          <td style="text-align: right;">$${valuation.input.assetValue.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Valuation Methodology</h2>
    <table>
      <thead>
        <tr>
          <th>Method</th>
          <th style="text-align: right;">Valuation (SGD)</th>
          <th style="text-align: center;">Weight</th>
        </tr>
      </thead>
      <tbody>
        ${valuation.methods
          .map(
            (method) => `
        <tr>
          <td>${method.method}</td>
          <td style="text-align: right;">$${method.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
          <td style="text-align: center;">${(method.weight * 100).toFixed(0)}%</td>
        </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Estimated Valuation Range</h2>
    <div class="valuation-range">
      <div class="valuation-item">
        <span class="valuation-label">🔻 Conservative</span>
        <span class="valuation-value">SGD $${valuation.conservative.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}</span>
      </div>
      <div class="valuation-item">
        <span class="valuation-label">⚖️ Fair Market Value</span>
        <span class="valuation-value">SGD $${valuation.fairMarket.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}</span>
      </div>
      <div class="valuation-item">
        <span class="valuation-label">🔺 Optimistic</span>
        <span class="valuation-value">SGD $${valuation.optimistic.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Value Drivers</h2>
    <div class="factors">
      <h3 class="positive">✓ Positive Factors</h3>
      <ul class="factor-list">
        ${valuation.positiveFactors.map((factor) => `<li>${factor}</li>`).join("")}
      </ul>

      <h3 class="negative">⚠ Risk Factors</h3>
      <ul class="factor-list">
        ${valuation.riskFactors.map((factor) => `<li>${factor}</li>`).join("")}
      </ul>
    </div>
  </div>

  <div class="section">
    <h2>Recommendations</h2>
    <p>${valuation.recommendations}</p>
  </div>

  <div class="footer">
    <p><strong>Disclaimer:</strong> This valuation is for informational purposes only and should not be considered as financial advice.
    Please consult with professional advisors before making any business decisions.</p>
    <p>Generated by BizBroker AI Valuation Agent • ${date}</p>
  </div>
</body>
</html>
  `.trim();
}

export async function POST(request: NextRequest) {
  try {
    const valuation: ValuationResult = await request.json();

    if (!valuation || !valuation.input) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid valuation data",
        },
        { status: 400 }
      );
    }

    const html = generatePDFHTML(valuation);

    // Return HTML that can be printed to PDF
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
