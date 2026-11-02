const fs = require('fs');
const path = require('path');

const basePath = 'D:/Ekonnet/EKONNET-TRADER';

// 1. EnterpriseBackground.tsx
{
  const p = path.join(basePath, 'src/components/common/EnterpriseBackground.tsx');
  let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

  // Strip containers from ambient floating icons
  c = c.replace(/p-3\.5 rounded-2xl bg-white\/70 dark:bg-slate-900\/40 backdrop-blur-md border border-slate-200\/60 dark:border-white\/10 shadow-xl shadow-blue-500\/5 animate-float-slow text-blue-500 dark:text-cyan-400 opacity-60 dark:opacity-40/g,
    'animate-float-slow text-blue-500/80 dark:text-cyan-400/60 drop-shadow-[0_0_15px_rgba(56,189,248,0.35)]');

  c = c.replace(/p-3 rounded-2xl bg-white\/70 dark:bg-slate-900\/40 backdrop-blur-md border border-slate-200\/60 dark:border-white\/10 shadow-xl shadow-emerald-500\/5 animate-float-reverse text-emerald-500 dark:text-emerald-400 opacity-55 dark:opacity-35/g,
    'animate-float-reverse text-emerald-500/80 dark:text-emerald-400/50 drop-shadow-[0_0_15px_rgba(16,185,129,0.35)]');

  c = c.replace(/p-3\.5 rounded-2xl bg-white\/70 dark:bg-slate-900\/40 backdrop-blur-md border border-slate-200\/60 dark:border-white\/10 shadow-xl shadow-indigo-500\/5 animate-float-slow text-indigo-500 dark:text-indigo-400 opacity-50 dark:opacity-30/g,
    'animate-float-slow text-indigo-500/80 dark:text-indigo-400/50 drop-shadow-[0_0_15px_rgba(99,102,241,0.35)]');

  c = c.replace(/p-3 rounded-2xl bg-white\/70 dark:bg-slate-900\/40 backdrop-blur-md border border-slate-200\/60 dark:border-white\/10 shadow-xl shadow-blue-500\/5 animate-float-reverse text-blue-500 dark:text-blue-400 opacity-55 dark:opacity-35/g,
    'animate-float-reverse text-blue-500/80 dark:text-blue-400/50 drop-shadow-[0_0_15px_rgba(59,130,246,0.35)]');

  c = c.replace(/p-3\.5 rounded-2xl bg-white\/70 dark:bg-slate-900\/40 backdrop-blur-md border border-slate-200\/60 dark:border-white\/10 shadow-xl shadow-purple-500\/5 animate-float-slow text-purple-500 dark:text-purple-400 opacity-45 dark:opacity-25/g,
    'animate-float-slow text-purple-500/80 dark:text-purple-400/40 drop-shadow-[0_0_15px_rgba(168,85,247,0.35)]');

  fs.writeFileSync(p, c, 'utf8');
  console.log('1. Updated EnterpriseBackground.tsx');
}

// 2. LiveTicker.tsx
{
  const p = path.join(basePath, 'src/components/landing/LiveTicker.tsx');
  let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

  c = c.replace('className="w-full bg-slate-950 border-b border-slate-800/80 py-2 overflow-hidden select-none"',
    'className="w-full bg-transparent border-b border-white/5 py-2.5 overflow-hidden select-none backdrop-blur-md"');

  c = c.replace('className="flex items-center gap-2 pr-3 border-r border-slate-800 text-[11px] font-bold text-slate-400 shrink-0"',
    'className="flex items-center gap-2 pr-4 border-r border-slate-200/40 dark:border-white/10 text-[11px] font-bold text-slate-600 dark:text-slate-300 shrink-0"');

  c = c.replace('className="flex items-center gap-2.5 shrink-0 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/30 transition cursor-pointer"',
    'className="flex items-center gap-2.5 shrink-0 px-3 py-1 hover:text-blue-400 transition cursor-pointer"');

  c = c.replace('className="text-xs font-bold text-white"',
    'className="text-xs font-bold text-slate-900 dark:text-white"');

  c = c.replace('className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-mono"',
    'className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono"');

  c = c.replace('className="text-xs font-mono font-semibold text-slate-200"',
    'className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200"');

  fs.writeFileSync(p, c, 'utf8');
  console.log('2. Updated LiveTicker.tsx');
}

// 3. HeroSection.tsx
{
  const p = path.join(basePath, 'src/components/landing/HeroSection.tsx');
  let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

  // Top Status Pill
  c = c.replace('className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 shadow-sm"',
    'className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-semibold text-blue-300 backdrop-blur-md shadow-sm"');

  // 3 Badges - remove chunky box container, make sleek and bare icon
  c = c.replace('className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left"',
    'className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.02] border border-white/5 text-left"');
  c = c.replace('className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left"',
    'className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.02] border border-white/5 text-left"');
  c = c.replace('className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left"',
    'className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.02] border border-white/5 text-left"');

  // Instant Market Swap card: replace chunky bg-slate-900/80 with sleek translucent glass HUD
  c = c.replace('className="relative rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl p-5 sm:p-6 backdrop-blur-xl"',
    'className="relative rounded-3xl bg-white/[0.03] dark:bg-slate-900/20 border border-white/10 shadow-2xl p-6 backdrop-blur-2xl"');

  // Swap header border
  c = c.replace('className="flex items-center justify-between pb-4 border-b border-slate-800"',
    'className="flex items-center justify-between pb-4 border-b border-white/10"');

  // Input boxes in swap widget
  c = c.replace(/flex items-center rounded-xl bg-slate-950 border border-slate-800 p-2\.5 focus-within:border-blue-500 transition/g,
    'flex items-center rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-2.5 focus-within:border-blue-500 transition');

  // Select dropdowns
  c = c.replace(/className=\"bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs font-bold text-slate-200 focus:outline-none ml-2\"/g,
    'className="bg-white/[0.06] dark:bg-slate-800/80 border border-white/10 rounded-lg px-2 py-1 text-xs font-bold text-slate-200 focus:outline-none ml-2"');

  // Calculation breakdown
  c = c.replace('className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1 text-[10px] font-mono"',
    'className="p-2.5 rounded-xl bg-transparent border border-white/10 space-y-1 text-[10px] font-mono"');

  c = c.replace('border-t border-slate-800 pt-1', 'border-t border-white/10 pt-1');

  // Live Market Terminal button
  c = c.replace('className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-2"',
    'className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-2"');

  fs.writeFileSync(p, c, 'utf8');
  console.log('3. Updated HeroSection.tsx');
}

// 4. PaymentRailSection.tsx
{
  const p = path.join(basePath, 'src/components/landing/PaymentRailSection.tsx');
  let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

  c = c.replace('className="py-16 bg-slate-950 border-t border-slate-800/80"',
    'className="py-16 bg-transparent border-t border-white/5"');

  c = c.replace('SECTION 11.[B] SPECIFICATIONS: 14 PAYMENT PROCESSORS COMBINED',
    'GLOBAL PAYMENT GATEWAY & 14 PROCESSORS COMBINED');

  // 12 payment rails
  c = c.replace('className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition text-center space-y-1.5"',
    'className="p-3.5 rounded-2xl bg-white/[0.02] dark:bg-white/[0.02] border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.04] transition-all text-center space-y-1.5 backdrop-blur-xs"');

  c = c.replace('border-t border-slate-800/80', 'border-t border-white/10');

  // FX calculator
  c = c.replace('className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 max-w-3xl mx-auto"',
    'className="rounded-3xl bg-white/[0.03] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl p-6 sm:p-8 max-w-3xl mx-auto shadow-2xl"');

  c = c.replace('className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-800"',
    'className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-white/10"');

  c = c.replace(/flex items-center rounded-xl bg-slate-950 border border-slate-800 p-2/g,
    'flex items-center rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 p-2.5');

  c = c.replace(/className=\"bg-slate-900 border border-slate-800 rounded px-2 py-0\.5 text-xs font-bold text-slate-200\"/g,
    'className="bg-white/[0.06] dark:bg-slate-800/80 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-200"');

  c = c.replace('border-t border-slate-800 flex justify-between', 'border-t border-white/10 flex justify-between');

  fs.writeFileSync(p, c, 'utf8');
  console.log('4. Updated PaymentRailSection.tsx');
}

// 5. SecurityHighlights.tsx
{
  const p = path.join(basePath, 'src/components/landing/SecurityHighlights.tsx');
  let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

  c = c.replace('className="py-16 bg-slate-950 border-t border-slate-800/80"',
    'className="py-16 bg-transparent border-t border-white/5"');

  // Replace cards: remove chunky bg-slate-900/60 border border-slate-800
  c = c.replace('className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 hover:border-emerald-500/30 transition"',
    'className="p-6 rounded-3xl bg-white/[0.02] dark:bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all backdrop-blur-xs space-y-3"');

  // CRITICAL: Remove icon container box (w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20...)
  c = c.replace(`<div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Icon className="w-4 h-4" />
                  </div>`,
    `<Icon className="w-5 h-5 text-emerald-400" />`);

  // Remove section badge box container
  c = c.replace('className="text-[10px] font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800"',
    'className="text-[11px] font-mono font-medium text-emerald-400/80"');

  fs.writeFileSync(p, c, 'utf8');
  console.log('5. Updated SecurityHighlights.tsx');
}

// 6. TradingPillars.tsx
{
  const p = path.join(basePath, 'src/components/landing/TradingPillars.tsx');
  let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

  c = c.replace('className="py-16 bg-slate-950 border-t border-slate-800/80"',
    'className="py-16 bg-transparent border-t border-white/5"');

  c = c.replace('SECTION 14 COMPLIANT: 3 MAIN TRADING MODES',
    'UNIFIED MULTI-ASSET TRADING ENGINE');

  c = c.replace('className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 mt-2"',
    'className="inline-flex p-1 rounded-xl bg-white/[0.03] dark:bg-slate-900/40 border border-white/10 mt-2"');

  // Remove icon box containers
  c = c.replace(`<div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ArrowLeftRight className="w-5 h-5" />
            </div>`,
    `<ArrowLeftRight className="w-6 h-6 text-blue-400" />`);

  c = c.replace(`<div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Users className="w-5 h-5" />
            </div>`,
    `<Users className="w-6 h-6 text-purple-400" />`);

  c = c.replace(`<div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Network className="w-5 h-5" />
            </div>`,
    `<Network className="w-6 h-6 text-cyan-400" />`);

  // Cards
  c = c.replace(/p-5 rounded-2xl bg-slate-900\/60 border border-slate-800 space-y-4 hover:border-blue-500\/40 transition/g,
    'p-6 rounded-3xl bg-white/[0.02] dark:bg-white/[0.02] border border-white/5 space-y-4 hover:border-blue-500/40 hover:bg-white/[0.04] transition-all backdrop-blur-xs');

  c = c.replace(/p-5 rounded-2xl bg-slate-900\/60 border border-slate-800 space-y-4 hover:border-purple-500\/40 transition/g,
    'p-6 rounded-3xl bg-white/[0.02] dark:bg-white/[0.02] border border-white/5 space-y-4 hover:border-purple-500/40 hover:bg-white/[0.04] transition-all backdrop-blur-xs');

  c = c.replace(/p-5 rounded-2xl bg-slate-900\/60 border border-slate-800 space-y-4 hover:border-cyan-500\/40 transition/g,
    'p-6 rounded-3xl bg-white/[0.02] dark:bg-white/[0.02] border border-white/5 space-y-4 hover:border-cyan-500/40 hover:bg-white/[0.04] transition-all backdrop-blur-xs');

  c = c.replace(/border-t border-slate-800\/80/g, 'border-t border-white/10');

  fs.writeFileSync(p, c, 'utf8');
  console.log('6. Updated TradingPillars.tsx');
}

// 7. PricingPackages.tsx
{
  const p = path.join(basePath, 'src/components/landing/PricingPackages.tsx');
  let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

  c = c.replace('className="py-16 bg-slate-950 border-t border-slate-800/80"',
    'className="py-16 bg-transparent border-t border-white/5"');

  c = c.replace('SECTION 55 & 56 COMPLIANT: ACCOUNT FEES & DEALS PACKAGES',
    'TRANSPARENT ACCOUNT TIERS & DEALS PACKAGES');

  c = c.replace('className="inline-flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 mt-2"',
    'className="inline-flex items-center gap-2 p-1 rounded-xl bg-white/[0.03] dark:bg-slate-900/40 border border-white/10 mt-2"');

  c = c.replace('bg-slate-900/90 border-2 border-blue-500 shadow-2xl relative',
    'bg-white/[0.03] dark:bg-slate-900/30 border-2 border-blue-500/80 shadow-2xl backdrop-blur-xl relative rounded-3xl');

  c = c.replace('bg-slate-900/60 border border-slate-800 hover:border-slate-700',
    'bg-white/[0.02] dark:bg-white/[0.02] border border-white/10 hover:border-blue-500/40 rounded-3xl backdrop-blur-xl transition-all');

  c = c.replace('border-t border-slate-800', 'border-t border-white/10');

  fs.writeFileSync(p, c, 'utf8');
  console.log('7. Updated PricingPackages.tsx');
}

// 8. Navbar.tsx & Footer.tsx
{
  const pNav = path.join(basePath, 'src/components/landing/Navbar.tsx');
  let cNav = fs.readFileSync(pNav, 'utf8').replace(/\r\n/g, '\n');

  cNav = cNav.replace('className="sticky top-0 z-50 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-all select-none"',
    'className="sticky top-0 z-50 w-full bg-slate-950/60 backdrop-blur-2xl border-b border-white/10 transition-all select-none"');

  cNav = cNav.replace('className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-blue-400 font-semibold tracking-wide flex items-center gap-1.5 transition"',
    'className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-[11px] text-blue-400 font-semibold tracking-wide flex items-center gap-1.5 transition"');

  fs.writeFileSync(pNav, cNav, 'utf8');
  console.log('8a. Updated Navbar.tsx');

  const pFoot = path.join(basePath, 'src/components/landing/Footer.tsx');
  let cFoot = fs.readFileSync(pFoot, 'utf8').replace(/\r\n/g, '\n');

  cFoot = cFoot.replace('className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs"',
    'className="bg-transparent border-t border-white/5 text-slate-400 text-xs backdrop-blur-xl"');

  cFoot = cFoot.replace('border-t border-slate-800/80', 'border-t border-white/10');

  fs.writeFileSync(pFoot, cFoot, 'utf8');
  console.log('8b. Updated Footer.tsx');
}
