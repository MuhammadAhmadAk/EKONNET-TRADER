import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ekonnet Trader — Global Multi-Asset Trades & Payments Platform",
  description: "Enterprise trading and funds transfer platform combining Crypto (5 Base Pairs), 168+ Forex currencies, global shares, and 14 integrated payment processors.",
  keywords: "Ekonnet, Crypto Trading, P2P Escrow, Forex, Shares, Payments, Wise, Binance, Bitfinex, Multi-Asset Trading",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B0F19] text-gray-100 min-h-screen antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
