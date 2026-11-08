import type { Metadata } from "next";
import "./globals.css";
import EnterpriseBackground from "@/components/common/EnterpriseBackground";
import LiveChatWidget from "@/components/common/LiveChatWidget";

export const metadata: Metadata = {
  title: "Ekonnet Trader — Global Multi-Asset Trades & Payments Platform",
  description: "Enterprise trading and funds transfer platform combining Crypto (5 Base Pairs), 168+ Forex currencies, global shares, and 14 integrated payment processors.",
  keywords: "Ekonnet, Crypto Trading, P2P Trading Rails, Forex, Shares, Payments, Wise, Binance, Bitfinex, Multi-Asset Trading",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Preload critical above-the-fold brand assets for instant 0ms visual rendering */}
        <link
          rel="preload"
          as="image"
          href="/images/ekonnet-logo-96.webp"
          type="image/webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/ekonnet-hero-512.webp"
          type="image/webp"
          fetchPriority="high"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('ekonnet_theme');
                if (savedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-transparent text-slate-800 dark:text-gray-100 min-h-screen antialiased selection:bg-orange-500 selection:text-white relative transition-colors duration-300">
        <EnterpriseBackground />
        {children}
        <LiveChatWidget />
      </body>
    </html>
  );
}
