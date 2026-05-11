import { Resend } from "resend";
import { BusinessListing, BuyerLead } from "@/types";

// ✅ 懒加载初始化 - 避免 build 时因缺少环境变量报错
const getResend = () => {
  return new Resend(process.env.RESEND_API_KEY!);
};

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

// 新Listing提交 - 通知Admin审核
export async function sendListingNotificationToAdmin(
  listing: BusinessListing,
  recordId: string
): Promise<void> {
  const resend = getResend();

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🏪 New Business Listing: ${listing.businessName}`,
      html: `
        <h2>New Business Listing Requires Review</h2>

        <h3>Business Details</h3>
        <ul>
          <li><strong>Business Name:</strong> ${listing.businessName}</li>
          <li><strong>Industry:</strong> ${listing.industry}</li>
          <li><strong>Location:</strong> ${listing.location}</li>
          <li><strong>Years in Operation:</strong> ${listing.yearsInOperation}</li>
          <li><strong>Annual Revenue:</strong> SGD ${listing.annualRevenue.toLocaleString()}</li>
          <li><strong>Net Profit:</strong> SGD ${listing.netProfit.toLocaleString()}</li>
          <li><strong>Asking Price:</strong> SGD ${listing.askingPrice.toLocaleString()}</li>
          <li><strong>Employees:</strong> ${listing.employees}</li>
        </ul>

        <h3>Seller Information</h3>
        <ul>
          <li><strong>Name:</strong> ${listing.sellerName}</li>
          <li><strong>Email:</strong> ${listing.sellerEmail}</li>
          <li><strong>Phone:</strong> ${listing.sellerPhone}</li>
        </ul>

        <h3>Business Description</h3>
        <p>${listing.description}</p>

        <h3>Key Assets</h3>
        <p>${listing.keyAssets}</p>

        <h3>Reason for Selling</h3>
        <p>${listing.reasonForSelling}</p>

        ${listing.aiSummary ? `<h3>AI Summary</h3><pre>${listing.aiSummary}</pre>` : ""}

        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #00D4AA; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">
            Review in Dashboard
          </a>
        </p>

        <p style="color: #666; font-size: 12px; margin-top: 40px;">
          Airtable Record ID: ${recordId}
        </p>
      `,
    });
  } catch (error) {
    console.error("Failed to send listing notification to admin:", error);
    // Fire-and-forget: 不阻塞主流程
  }
}

// 新Listing提交 - 确认邮件给卖家
export async function sendListingConfirmationToSeller(
  listing: BusinessListing
): Promise<void> {
  const resend = getResend();

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: listing.sellerEmail,
      subject: `✅ Your Business Listing Has Been Submitted - ${listing.businessName}`,
      html: `
        <h2>Thank You for Listing Your Business with BizBroker AI</h2>

        <p>Dear ${listing.sellerName},</p>

        <p>We've received your business listing for <strong>${listing.businessName}</strong>.</p>

        <h3>What Happens Next?</h3>
        <ol>
          <li><strong>Review:</strong> Our team will review your listing within 24-48 hours</li>
          <li><strong>Approval:</strong> Once approved, your listing will be published to our platform</li>
          <li><strong>Matching:</strong> We'll start matching qualified buyers to your business</li>
          <li><strong>Updates:</strong> You'll receive notifications when buyers express interest</li>
        </ol>

        <h3>Your Listing Summary</h3>
        <ul>
          <li><strong>Business:</strong> ${listing.businessName}</li>
          <li><strong>Industry:</strong> ${listing.industry}</li>
          <li><strong>Location:</strong> ${listing.location}</li>
          <li><strong>Asking Price:</strong> SGD ${listing.askingPrice.toLocaleString()}</li>
        </ul>

        <p>If you have any questions or need to update your listing, please reply to this email.</p>

        <p>Best regards,<br>
        <strong>BizBroker AI Team</strong></p>

        <p style="color: #666; font-size: 12px; margin-top: 40px;">
          This is an automated confirmation email.
        </p>
      `,
    });
  } catch (error) {
    console.error("Failed to send confirmation to seller:", error);
    // Fire-and-forget: 不阻塞主流程
  }
}

// 新Lead入库 - 通知Admin
export async function sendLeadNotificationToAdmin(
  lead: BuyerLead,
  recordId: string
): Promise<void> {
  const resend = getResend();

  // 根据tier设置优先级标识
  const tierEmoji = lead.tier.split(" ")[0]; // 🔥 or 🌡️ or ❄️
  const tierName = lead.tier.includes("Hot")
    ? "HOT"
    : lead.tier.includes("Warm")
      ? "WARM"
      : "COLD";

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `${tierEmoji} ${tierName} LEAD: ${lead.name} - Score ${lead.leadScore}/100`,
      html: `
        <h2>${tierEmoji} ${tierName} Lead Alert</h2>

        <div style="background: ${lead.tier.includes("Hot") ? "#FFF3E0" : lead.tier.includes("Warm") ? "#E8F5E9" : "#E3F2FD"}; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin-top: 0;">Lead Score: ${lead.leadScore}/100</h3>
          <p><strong>Classification:</strong> ${lead.tier}</p>
        </div>

        <h3>Buyer Information</h3>
        <ul>
          <li><strong>Name:</strong> ${lead.name}</li>
          <li><strong>Email:</strong> ${lead.email}</li>
          <li><strong>Phone:</strong> ${lead.phone}</li>
        </ul>

        <h3>Investment Profile</h3>
        <ul>
          <li><strong>Budget:</strong> SGD ${lead.budget.toLocaleString()}</li>
          <li><strong>Funding Source:</strong> ${lead.fundingSource}</li>
          <li><strong>Timeline:</strong> ${lead.timeline}</li>
          <li><strong>ROI Expectation:</strong> ${lead.roiExpectation}%</li>
          <li><strong>Business Experience:</strong> ${lead.hasBusinessExperience ? "Yes" : "No"}</li>
        </ul>

        <h3>Preferences</h3>
        <ul>
          <li><strong>Industries:</strong> ${lead.preferredIndustries}</li>
          <li><strong>Location:</strong> ${lead.preferredLocation}</li>
        </ul>

        <h3>Score Breakdown</h3>
        <pre>${lead.scoreBreakdown}</pre>

        ${lead.chatSummary ? `<h3>Chat Summary</h3><p>${lead.chatSummary}</p>` : ""}

        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #FFB84D; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; margin-top: 16px;">
            View Lead in Dashboard
          </a>
        </p>

        ${
          lead.tier.includes("Hot")
            ? `
          <div style="background: #FFEBEE; border-left: 4px solid #F44336; padding: 16px; margin-top: 24px;">
            <strong>🔥 ACTION REQUIRED:</strong> This is a hot lead. Contact within 1 hour for best results.
          </div>
        `
            : ""
        }

        <p style="color: #666; font-size: 12px; margin-top: 40px;">
          Airtable Record ID: ${recordId}
        </p>
      `,
    });
  } catch (error) {
    console.error("Failed to send lead notification to admin:", error);
    // Fire-and-forget: 不阻塞主流程
  }
}
