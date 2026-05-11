import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BizBroker AI - Singapore Business M&A Platform",
  description:
    "AI-powered business brokerage platform for Singapore SMEs. 5 intelligent agents for seller onboarding, valuation, buyer matching, due diligence, and lead qualification.",
  keywords: [
    "business brokerage",
    "Singapore SME",
    "business acquisition",
    "M&A platform",
    "AI broker",
    "business valuation",
  ],
  authors: [{ name: "BizBroker AI" }],
  openGraph: {
    title: "BizBroker AI - Singapore Business M&A Platform",
    description:
      "AI-powered business brokerage with 5 intelligent agents for seamless M&A transactions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
