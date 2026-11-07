"use client";

import { useState, useEffect, useRef } from "react";

export interface LiveCoinMarket {
  symbol: string;          // e.g. "BTC"
  pair: string;            // e.g. "BTCUSDT"
  name: string;            // e.g. "Bitcoin"
  price: number;
  formattedPrice: string;
  changePercent: number;
  formattedChange: string;
  isPositive: boolean;
  high24h: number;
  low24h: number;
  volume: number;
  priceDirection: "up" | "down" | null;
  iconBg: string;
  iconText: string;
}

export interface LiveTickerItem {
  symbol: string;          // e.g. "BTC/USD"
  pair: string;            // e.g. "BTCUSDT"
  category: "Crypto" | "Forex" | "Commodity";
  price: number;
  formattedPrice: string;
  change24h: number;
  formattedChange: string;
  isPositive: boolean;
  priceDirection: "up" | "down" | null;
}

const INITIAL_FEATURED_COINS: LiveCoinMarket[] = [
  {
    symbol: "BTC",
    pair: "BTCUSDT",
    name: "Bitcoin",
    price: 75780.0,
    formattedPrice: "$75,780.00",
    changePercent: 0.15,
    formattedChange: "+0.15%",
    isPositive: true,
    high24h: 76500.0,
    low24h: 75100.0,
    volume: 32450.5,
    priceDirection: null,
    iconBg: "bg-amber-500",
    iconText: "₿",
  },
  {
    symbol: "ETH",
    pair: "ETHUSDT",
    name: "Ethereum",
    price: 2235.5,
    formattedPrice: "$2,235.50",
    changePercent: 0.45,
    formattedChange: "+0.45%",
    isPositive: true,
    high24h: 2280.0,
    low24h: 2210.0,
    volume: 189200.2,
    priceDirection: null,
    iconBg: "bg-blue-600",
    iconText: "Ξ",
  },
  {
    symbol: "SOL",
    pair: "SOLUSDT",
    name: "Solana",
    price: 89.65,
    formattedPrice: "$89.65",
    changePercent: -0.85,
    formattedChange: "-0.85%",
    isPositive: false,
    high24h: 92.4,
    low24h: 88.2,
    volume: 645120.0,
    priceDirection: null,
    iconBg: "bg-gradient-to-tr from-purple-600 to-indigo-600",
    iconText: "◎",
  },
  {
    symbol: "BNB",
    pair: "BNBUSDT",
    name: "BNB",
    price: 694.2,
    formattedPrice: "$694.20",
    changePercent: -0.04,
    formattedChange: "-0.04%",
    isPositive: false,
    high24h: 702.0,
    low24h: 688.0,
    volume: 78940.0,
    priceDirection: null,
    iconBg: "bg-yellow-500",
    iconText: "❖",
  },
  {
    symbol: "XRP",
    pair: "XRPUSDT",
    name: "XRP",
    price: 1.1605,
    formattedPrice: "$1.1605",
    changePercent: -2.85,
    formattedChange: "-2.85%",
    isPositive: false,
    high24h: 1.215,
    low24h: 1.142,
    volume: 2450000.0,
    priceDirection: null,
    iconBg: "bg-slate-900 dark:bg-slate-800",
    iconText: "✕",
  },
];

const INITIAL_ALL_TICKERS: LiveTickerItem[] = [
  { symbol: "BTC/USD", pair: "BTCUSDT", category: "Crypto", price: 75780.0, formattedPrice: "$75,780.00", change24h: 0.15, formattedChange: "+0.15%", isPositive: true, priceDirection: null },
  { symbol: "ETH/USD", pair: "ETHUSDT", category: "Crypto", price: 2235.5, formattedPrice: "$2,235.50", change24h: 0.45, formattedChange: "+0.45%", isPositive: true, priceDirection: null },
  { symbol: "SOL/USD", pair: "SOLUSDT", category: "Crypto", price: 89.65, formattedPrice: "$89.65", change24h: -0.85, formattedChange: "-0.85%", isPositive: false, priceDirection: null },
  { symbol: "BNB/USD", pair: "BNBUSDT", category: "Crypto", price: 694.2, formattedPrice: "$694.20", change24h: -0.04, formattedChange: "-0.04%", isPositive: false, priceDirection: null },
  { symbol: "XRP/USD", pair: "XRPUSDT", category: "Crypto", price: 1.1605, formattedPrice: "$1.1605", change24h: -2.85, formattedChange: "-2.85%", isPositive: false, priceDirection: null },
  { symbol: "DOGE/USD", pair: "DOGEUSDT", category: "Crypto", price: 0.1985, formattedPrice: "$0.1985", change24h: 4.25, formattedChange: "+4.25%", isPositive: true, priceDirection: null },
  { symbol: "ADA/USD", pair: "ADAUSDT", category: "Crypto", price: 0.4320, formattedPrice: "$0.4320", change24h: 1.12, formattedChange: "+1.12%", isPositive: true, priceDirection: null },
  { symbol: "AVAX/USD", pair: "AVAXUSDT", category: "Crypto", price: 28.45, formattedPrice: "$28.45", change24h: 3.40, formattedChange: "+3.40%", isPositive: true, priceDirection: null },
  { symbol: "DOT/USD", pair: "DOTUSDT", category: "Crypto", price: 4.82, formattedPrice: "$4.82", change24h: -0.65, formattedChange: "-0.65%", isPositive: false, priceDirection: null },
  { symbol: "LINK/USD", pair: "LINKUSDT", category: "Crypto", price: 13.95, formattedPrice: "$13.95", change24h: 2.15, formattedChange: "+2.15%", isPositive: true, priceDirection: null },
  { symbol: "LTC/USD", pair: "LTCUSDT", category: "Crypto", price: 78.60, formattedPrice: "$78.60", change24h: 0.95, formattedChange: "+0.95%", isPositive: true, priceDirection: null },
  { symbol: "BCH/USD", pair: "BCHUSDT", category: "Crypto", price: 382.40, formattedPrice: "$382.40", change24h: 5.67, formattedChange: "+5.67%", isPositive: true, priceDirection: null },
  { symbol: "NEAR/USD", pair: "NEARUSDT", category: "Crypto", price: 3.65, formattedPrice: "$3.65", change24h: -1.25, formattedChange: "-1.25%", isPositive: false, priceDirection: null },
  { symbol: "SUI/USD", pair: "SUIUSDT", category: "Crypto", price: 2.34, formattedPrice: "$2.34", change24h: 8.45, formattedChange: "+8.45%", isPositive: true, priceDirection: null },
  { symbol: "SHIB/USD", pair: "SHIBUSDT", category: "Crypto", price: 0.0000185, formattedPrice: "$0.0000185", change24h: 3.12, formattedChange: "+3.12%", isPositive: true, priceDirection: null },
  { symbol: "TRX/USD", pair: "TRXUSDT", category: "Crypto", price: 0.1625, formattedPrice: "$0.1625", change24h: 0.42, formattedChange: "+0.42%", isPositive: true, priceDirection: null },
  { symbol: "UNI/USD", pair: "UNIUSDT", category: "Crypto", price: 8.75, formattedPrice: "$8.75", change24h: 1.85, formattedChange: "+1.85%", isPositive: true, priceDirection: null },
  { symbol: "APT/USD", pair: "APTUSDT", category: "Crypto", price: 9.60, formattedPrice: "$9.60", change24h: -2.10, formattedChange: "-2.10%", isPositive: false, priceDirection: null },
  // Major Forex & Commodities
  { symbol: "EUR/USD", pair: "EURUSD", category: "Forex", price: 1.0875, formattedPrice: "1.0875", change24h: 0.12, formattedChange: "+0.12%", isPositive: true, priceDirection: null },
  { symbol: "GBP/USD", pair: "GBPUSD", category: "Forex", price: 1.2980, formattedPrice: "1.2980", change24h: 0.24, formattedChange: "+0.24%", isPositive: true, priceDirection: null },
  { symbol: "USD/JPY", pair: "USDJPY", category: "Forex", price: 152.45, formattedPrice: "152.45", change24h: -0.18, formattedChange: "-0.18%", isPositive: false, priceDirection: null },
  { symbol: "USD/CHF", pair: "USDCHF", category: "Forex", price: 0.8712, formattedPrice: "0.8712", change24h: -0.05, formattedChange: "-0.05%", isPositive: false, priceDirection: null },
  { symbol: "AUD/USD", pair: "AUDUSD", category: "Forex", price: 0.6620, formattedPrice: "0.6620", change24h: 0.31, formattedChange: "+0.31%", isPositive: true, priceDirection: null },
  { symbol: "USD/CAD", pair: "USDCAD", category: "Forex", price: 1.3890, formattedPrice: "1.3890", change24h: -0.14, formattedChange: "-0.14%", isPositive: false, priceDirection: null },
  { symbol: "XAU/USD", pair: "XAUUSD", category: "Commodity", price: 2738.50, formattedPrice: "$2,738.50", change24h: 0.82, formattedChange: "+0.82%", isPositive: true, priceDirection: null },
  { symbol: "WTI/USD", pair: "WTIUSD", category: "Commodity", price: 71.25, formattedPrice: "$71.25", change24h: -0.45, formattedChange: "-0.45%", isPositive: false, priceDirection: null },
];

const TRACKED_CRYPTO_PAIRS = [
  "BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT", 
  "DOGEUSDT", "ADAUSDT", "AVAXUSDT", "DOTUSDT", "LINKUSDT", 
  "LTCUSDT", "BCHUSDT", "NEARUSDT", "SUIUSDT", "SHIBUSDT", 
  "TRXUSDT", "UNIUSDT", "APTUSDT"
];

function formatCoinPrice(val: number, isForex = false): string {
  if (isForex) {
    return val >= 50 ? val.toFixed(2) : val.toFixed(4);
  }
  if (val >= 1000) {
    return "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (val >= 1) {
    return "$" + val.toFixed(2);
  }
  if (val >= 0.001) {
    return "$" + val.toFixed(4);
  }
  return "$" + val.toFixed(7);
}

function formatCoinChange(val: number): string {
  const sign = val >= 0 ? "+" : "";
  return `${sign}${val.toFixed(2)}%`;
}

export function useBinanceLivePrices() {
  const [coins, setCoins] = useState<LiveCoinMarket[]>(INITIAL_FEATURED_COINS);
  const [allTickers, setAllTickers] = useState<LiveTickerItem[]>(INITIAL_ALL_TICKERS);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  const flashTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const tickerFlashTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const wsRef = useRef<WebSocket | null>(null);

  // 1. Initial REST Snapshot for instant real prices across all tracked crypto pairs
  useEffect(() => {
    let isMounted = true;

    async function fetchInitialSnapshots() {
      try {
        const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(TRACKED_CRYPTO_PAIRS))}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted || !Array.isArray(data)) return;

        // Update 5 Featured Coins
        setCoins((prev) =>
          prev.map((coin) => {
            const match = data.find((d: any) => d.symbol === coin.pair);
            if (!match) return coin;
            const newPrice = parseFloat(match.lastPrice);
            const changeP = parseFloat(match.priceChangePercent);
            return {
              ...coin,
              price: newPrice,
              formattedPrice: formatCoinPrice(newPrice),
              changePercent: changeP,
              formattedChange: formatCoinChange(changeP),
              isPositive: changeP >= 0,
              high24h: parseFloat(match.highPrice),
              low24h: parseFloat(match.lowPrice),
              volume: parseFloat(match.volume),
            };
          })
        );

        // Update All Market Tickers
        setAllTickers((prev) =>
          prev.map((ticker) => {
            const match = data.find((d: any) => d.symbol === ticker.pair);
            if (!match) return ticker;
            const newPrice = parseFloat(match.lastPrice);
            const changeP = parseFloat(match.priceChangePercent);
            return {
              ...ticker,
              price: newPrice,
              formattedPrice: formatCoinPrice(newPrice, ticker.category === "Forex"),
              change24h: changeP,
              formattedChange: formatCoinChange(changeP),
              isPositive: changeP >= 0,
            };
          })
        );
      } catch (err) {
        // Fallback gracefully to preset values
      }
    }

    fetchInitialSnapshots();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. High-Frequency Real-time Binance WebSocket Stream (All-Market Mini Ticker)
  useEffect(() => {
    let reconnectTimer: NodeJS.Timeout;
    let shouldReconnect = true;

    function connectWs() {
      // Connect to Binance All-Market Mini Ticker Stream (!miniTicker@arr)
      const streamUrl = "wss://stream.binance.com:9443/ws/!miniTicker@arr";

      try {
        const ws = new WebSocket(streamUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const tickerArray = JSON.parse(event.data);
            if (!Array.isArray(tickerArray)) return;

            // Map incoming ticks into a fast lookup map
            const updateMap = new Map<string, { price: number; changeP: number }>();
            for (let i = 0; i < tickerArray.length; i++) {
              const item = tickerArray[i];
              if (TRACKED_CRYPTO_PAIRS.includes(item.s)) {
                const c = parseFloat(item.c);
                const o = parseFloat(item.o);
                const change = o > 0 ? ((c - o) / o) * 100 : 0;
                updateMap.set(item.s, { price: c, changeP: change });
              }
            }

            if (updateMap.size === 0) return;

            // Update Featured Coins (Cards)
            setCoins((prevCoins) =>
              prevCoins.map((coin) => {
                const tick = updateMap.get(coin.pair);
                if (!tick || isNaN(tick.price)) return coin;

                const direction: "up" | "down" | null =
                  tick.price > coin.price ? "up" : tick.price < coin.price ? "down" : coin.priceDirection;

                if (direction !== null && flashTimers.current[coin.symbol]) {
                  clearTimeout(flashTimers.current[coin.symbol]);
                }

                if (direction !== null) {
                  flashTimers.current[coin.symbol] = setTimeout(() => {
                    setCoins((curr) =>
                      curr.map((c) => (c.symbol === coin.symbol ? { ...c, priceDirection: null } : c))
                    );
                  }, 800);
                }

                return {
                  ...coin,
                  price: tick.price,
                  formattedPrice: formatCoinPrice(tick.price),
                  changePercent: tick.changeP,
                  formattedChange: formatCoinChange(tick.changeP),
                  isPositive: tick.changeP >= 0,
                  priceDirection: direction,
                };
              })
            );

            // Update All Market Tickers (Marquee)
            setAllTickers((prevTickers) =>
              prevTickers.map((ticker) => {
                const tick = updateMap.get(ticker.pair);
                if (!tick || isNaN(tick.price)) return ticker;

                const direction: "up" | "down" | null =
                  tick.price > ticker.price ? "up" : tick.price < ticker.price ? "down" : ticker.priceDirection;

                if (direction !== null && tickerFlashTimers.current[ticker.symbol]) {
                  clearTimeout(tickerFlashTimers.current[ticker.symbol]);
                }

                if (direction !== null) {
                  tickerFlashTimers.current[ticker.symbol] = setTimeout(() => {
                    setAllTickers((curr) =>
                      curr.map((t) => (t.symbol === ticker.symbol ? { ...t, priceDirection: null } : t))
                    );
                  }, 800);
                }

                return {
                  ...ticker,
                  price: tick.price,
                  formattedPrice: formatCoinPrice(tick.price, ticker.category === "Forex"),
                  change24h: tick.changeP,
                  formattedChange: formatCoinChange(tick.changeP),
                  isPositive: tick.changeP >= 0,
                  priceDirection: direction,
                };
              })
            );
          } catch (e) {
            // Ignore malformed payloads
          }
        };

        ws.onerror = () => {
          setIsConnected(false);
        };

        ws.onclose = () => {
          setIsConnected(false);
          if (shouldReconnect) {
            reconnectTimer = setTimeout(connectWs, 3000);
          }
        };
      } catch (err) {
        setIsConnected(false);
        if (shouldReconnect) {
          reconnectTimer = setTimeout(connectWs, 4000);
        }
      }
    }

    connectWs();

    return () => {
      shouldReconnect = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (wsRef.current) {
        wsRef.current.close();
      }
      Object.values(flashTimers.current).forEach(clearTimeout);
      Object.values(tickerFlashTimers.current).forEach(clearTimeout);
    };
  }, []);

  return { coins, allTickers, isConnected };
}
