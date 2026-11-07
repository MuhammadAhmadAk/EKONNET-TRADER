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

const INITIAL_COINS: LiveCoinMarket[] = [
  {
    symbol: "BTC",
    pair: "BTCUSDT",
    name: "Bitcoin",
    price: 75790.0,
    formattedPrice: "$75,790.00",
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
    price: 2237.5,
    formattedPrice: "$2,237.50",
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

function formatCoinPrice(val: number): string {
  if (val >= 1000) {
    return "$" + val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (val >= 1) {
    return "$" + val.toFixed(2);
  }
  return "$" + val.toFixed(4);
}

function formatCoinChange(val: number): string {
  const sign = val >= 0 ? "+" : "";
  return `${sign}${val.toFixed(2)}%`;
}

export function useBinanceLivePrices() {
  const [coins, setCoins] = useState<LiveCoinMarket[]>(INITIAL_COINS);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const flashTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const wsRef = useRef<WebSocket | null>(null);

  // 1. Snapshot fetch via Binance REST API for instantaneous accurate data
  useEffect(() => {
    let isMounted = true;

    async function fetchInitialPrices() {
      try {
        const symbolsParam = encodeURIComponent(JSON.stringify(["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"]));
        const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${symbolsParam}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted || !Array.isArray(data)) return;

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
      } catch (err) {
        // Fallback silently if offline or restricted
      }
    }

    fetchInitialPrices();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. High-Frequency Real-time Binance WebSocket Stream
  useEffect(() => {
    let reconnectTimer: NodeJS.Timeout;
    let shouldReconnect = true;

    function connectWs() {
      const streamUrl =
        "wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/solusdt@ticker/bnbusdt@ticker/xrpusdt@ticker";

      try {
        const ws = new WebSocket(streamUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (!message || !message.data) return;

            const ticker = message.data;
            const pairSymbol = ticker.s; // e.g. "BTCUSDT"
            const newPrice = parseFloat(ticker.c);
            const changeP = parseFloat(ticker.P);

            if (!pairSymbol || isNaN(newPrice)) return;

            setCoins((prevCoins) =>
              prevCoins.map((coin) => {
                if (coin.pair !== pairSymbol) return coin;

                const direction: "up" | "down" | null =
                  newPrice > coin.price ? "up" : newPrice < coin.price ? "down" : coin.priceDirection;

                // Clear previous flash timer if active
                if (flashTimers.current[coin.symbol]) {
                  clearTimeout(flashTimers.current[coin.symbol]);
                }

                // Auto reset flash state after 800ms
                if (direction !== null) {
                  flashTimers.current[coin.symbol] = setTimeout(() => {
                    setCoins((curr) =>
                      curr.map((c) => (c.symbol === coin.symbol ? { ...c, priceDirection: null } : c))
                    );
                  }, 800);
                }

                return {
                  ...coin,
                  price: newPrice,
                  formattedPrice: formatCoinPrice(newPrice),
                  changePercent: changeP,
                  formattedChange: formatCoinChange(changeP),
                  isPositive: changeP >= 0,
                  high24h: parseFloat(ticker.h) || coin.high24h,
                  low24h: parseFloat(ticker.l) || coin.low24h,
                  volume: parseFloat(ticker.v) || coin.volume,
                  priceDirection: direction,
                };
              })
            );
          } catch (e) {
            // ignore malformed payloads
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
    };
  }, []);

  return { coins, isConnected };
}
