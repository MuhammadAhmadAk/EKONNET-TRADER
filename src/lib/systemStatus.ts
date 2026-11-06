export interface TradingPlatformStatus {
  id: string;
  name: string;
  route: string;
  status: "Online" | "Maintenance";
  lastUpdated: string;
  description: string;
}

export const INITIAL_PLATFORM_STATUSES: TradingPlatformStatus[] = [
  { 
    id: "crypto-direct", 
    name: "Direct Crypto Exchange", 
    route: "/trades/crypto/direct", 
    status: "Online", 
    lastUpdated: "Active", 
    description: "Proprietary in-browser order book matching engine" 
  },
  { 
    id: "crypto-p2p", 
    name: "Peer-to-Peer Crypto Settlement", 
    route: "/trades/crypto/p2p", 
    status: "Online", 
    lastUpdated: "Active", 
    description: "Direct counterparty smart fiat settlement" 
  },
  { 
    id: "crypto-third-party", 
    name: "Third-Party Liquidity Hub", 
    route: "/trades/crypto/third-party", 
    status: "Online", 
    lastUpdated: "Active", 
    description: "External institutional liquidity routing" 
  },
  { 
    id: "forex", 
    name: "Forex Trading Platform", 
    route: "/trades/forex", 
    status: "Online", 
    lastUpdated: "Active", 
    description: "168+ Global sovereign currency pairs" 
  },
  { 
    id: "shares", 
    name: "Shares & Investment Platform", 
    route: "/trades/shares", 
    status: "Online", 
    lastUpdated: "Active", 
    description: "Wall Street equities, fractional shares, and ETFs" 
  }
];

export function getPlatformStatus(platformId: string): "Online" | "Maintenance" {
  if (typeof window === "undefined") return "Online";
  try {
    const saved = localStorage.getItem(`ekonnet_status_${platformId}`);
    if (saved === "Maintenance") return "Maintenance";
  } catch (e) {
    // Ignore storage errors
  }
  return "Online";
}

export function setPlatformStatus(platformId: string, status: "Online" | "Maintenance") {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`ekonnet_status_${platformId}`, status);
  } catch (e) {
    // Ignore storage errors
  }
}
