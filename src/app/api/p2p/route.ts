import { NextRequest, NextResponse } from 'next/server';

// In-memory cache to prevent rate-limits and optimize server response time
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 1000; // 10 seconds

const FIAT_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  PKR: '₨',
  AED: 'AED ',
  CAD: 'C$',
  AUD: 'A$',
  INR: '₹',
};

// High-fidelity fallback offers in case external API is temporarily unreachable
const FALLBACK_OFFERS: Record<string, any[]> = {
  BTC: [
    {
      advNo: "adv-btc-1",
      advertiserName: "CryptoWhale_Prime",
      monthOrderCount: 1420,
      monthFinishRate: "99.8",
      price: "67,200.00",
      fiatUnit: "USD",
      fiatSymbol: "$",
      asset: "BTC",
      availableAmount: "4.5000",
      minLimit: "500",
      maxLimit: "50,000",
      tradeMethods: ["Wise", "Bank Swift Wire", "Revolut"]
    },
    {
      advNo: "adv-btc-2",
      advertiserName: "EuroFastSettle",
      monthOrderCount: 880,
      monthFinishRate: "100.0",
      price: "62,100.00",
      fiatUnit: "EUR",
      fiatSymbol: "€",
      asset: "BTC",
      availableAmount: "2.1000",
      minLimit: "200",
      maxLimit: "20,000",
      tradeMethods: ["SEPA Instant", "Revolut", "Skrill"]
    }
  ],
  ETH: [
    {
      advNo: "adv-eth-1",
      advertiserName: "GlobalPeer_Direct",
      monthOrderCount: 650,
      monthFinishRate: "99.2",
      price: "2,535.00",
      fiatUnit: "USD",
      fiatSymbol: "$",
      asset: "ETH",
      availableAmount: "25.0000",
      minLimit: "100",
      maxLimit: "15,000",
      tradeMethods: ["PayPal Direct", "Wise", "Card Transfer"]
    }
  ],
  USDT: [
    {
      advNo: "adv-usdt-1",
      advertiserName: "SovereignLiquidity",
      monthOrderCount: 2310,
      monthFinishRate: "99.9",
      price: "1.00",
      fiatUnit: "USD",
      fiatSymbol: "$",
      asset: "USDT",
      availableAmount: "150,000.0000",
      minLimit: "1,000",
      maxLimit: "100,000",
      tradeMethods: ["Bank Swift Wire", "SEPA", "Wise"]
    }
  ]
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const asset = (searchParams.get('asset') || 'BTC').toUpperCase();
  const fiat = (searchParams.get('fiat') || 'USD').toUpperCase();
  const tradeType = (searchParams.get('tradeType') || 'BUY').toUpperCase();

  const cacheKey = `${asset}-${fiat}-${tradeType}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ offers: cached.data, cached: true });
  }

  try {
    const response = await fetch(
      'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        body: JSON.stringify({
          fiat,
          page: 1,
          rows: 15,
          tradeType,
          asset,
          countries: [],
          proMerchantAds: false,
          shieldMerchantAds: false,
          publisherType: null,
          payTypes: [],
        }),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`Binance P2P upstream HTTP status: ${response.status}`);
    }

    const result = await response.json();

    if (result.data && Array.isArray(result.data) && result.data.length > 0) {
      const offers = result.data.map((item: any) => {
        const adv = item.adv || {};
        const advertiser = item.advertiser || {};
        const fiatUnit = adv.fiatUnit || fiat;
        const fiatSymbol = adv.fiatSymbol || FIAT_SYMBOLS[fiatUnit] || '$';

        return {
          advNo: adv.advNo || String(Math.random()),
          advertiserName: advertiser.nickName || 'Verified_Merchant',
          monthOrderCount: advertiser.monthOrderCount || 0,
          monthFinishRate: ((advertiser.monthFinishRate || 1) * 100).toFixed(1),
          price: parseFloat(adv.price || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          fiatUnit,
          fiatSymbol,
          asset: adv.asset || asset,
          availableAmount: parseFloat(adv.surplusAmount || 0).toLocaleString('en-US', {
            maximumFractionDigits: 4,
          }),
          minLimit: parseFloat(adv.minSingleTransAmount || 0).toLocaleString('en-US'),
          maxLimit: parseFloat(adv.maxSingleTransAmount || 0).toLocaleString('en-US'),
          tradeMethods: (adv.tradeMethods || []).map(
            (m: any) => m.tradeMethodShortName || m.tradeMethodName || 'Bank Transfer'
          ),
        };
      });

      cache.set(cacheKey, { data: offers, timestamp: Date.now() });
      return NextResponse.json({ offers, cached: false });
    }

    // Fallback if Binance returned empty list for this specific pair
    const fallbacks = FALLBACK_OFFERS[asset] || FALLBACK_OFFERS.BTC;
    const adjustedFallbacks = fallbacks.map(f => ({
      ...f,
      fiatUnit: fiat,
      fiatSymbol: FIAT_SYMBOLS[fiat] || '$',
      asset
    }));

    return NextResponse.json({ offers: adjustedFallbacks, cached: false, fallback: true });
  } catch (error: any) {
    console.error('P2P proxy fetch error:', error.message);
    const fallbacks = FALLBACK_OFFERS[asset] || FALLBACK_OFFERS.BTC;
    const adjustedFallbacks = fallbacks.map(f => ({
      ...f,
      fiatUnit: fiat,
      fiatSymbol: FIAT_SYMBOLS[fiat] || '$',
      asset
    }));
    return NextResponse.json({ offers: adjustedFallbacks, cached: false, fallback: true });
  }
}
