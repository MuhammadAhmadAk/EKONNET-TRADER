import { NextResponse } from "next/server";
import { INITIAL_MARKET_TICKERS, BASE_PAIRS } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json({
    success: true,
    basePairs: BASE_PAIRS,
    tickers: INITIAL_MARKET_TICKERS,
    timestamp: new Date().toISOString()
  });
}
