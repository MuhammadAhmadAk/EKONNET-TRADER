const fs = require('fs');
const path = require('path');

const basePath = 'D:/Ekonnet/EKONNET-TRADER';

// 1. trades/page.tsx
{
  const p = path.join(basePath, 'src/app/trades/page.tsx');
  let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

  // Replace header back button
  c = c.replace('className="p-2 rounded-xl bg-[#161F33] text-gray-400 hover:text-white transition-colors"',
    'className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-gray-300 hover:text-white transition-colors"');

  // Pair selector bar
  c = c.replace('className="p-4 rounded-2xl bg-[#111827] border border-[#1F293D] flex flex-col sm:flex-row sm:items-center justify-between gap-4"',
    'className="p-4 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"');

  // Chart Container
  c = c.replace('className="p-6 rounded-3xl bg-[#111827] border border-[#1F293D] shadow-2xl space-y-4"',
    'className="p-6 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl shadow-2xl space-y-4"');

  // Remove icon box container: <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold font-mono">
  c = c.replace('<div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold font-mono">\n                    BTC\n                  </div>',
    '<div className="text-xl font-black font-mono text-cyan-400 mr-1">\n                    BTC\n                  </div>');

  // Graphic Chart Display Canvas
  c = c.replace('className="h-64 rounded-2xl bg-[#0B0F19] border border-gray-800/80 p-4 flex flex-col justify-between relative overflow-hidden"',
    'className="h-64 rounded-2xl bg-white/[0.02] dark:bg-black/20 border border-white/10 p-4 flex flex-col justify-between relative overflow-hidden"');

  // Markets List
  c = c.replace('className="rounded-3xl bg-[#111827] border border-[#1F293D] overflow-hidden p-6 space-y-4"',
    'className="rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl overflow-hidden p-6 space-y-4"');

  c = c.replace('className="hover:bg-[#161F33] cursor-pointer"',
    'className="hover:bg-white/[0.03] transition-colors cursor-pointer"');

  // Right Column: Order Execution Panel
  c = c.replace('className="lg:col-span-4 rounded-3xl bg-[#111827] border border-[#1F293D] p-6 space-y-6 shadow-2xl"',
    'className="lg:col-span-4 rounded-3xl bg-white/[0.03] dark:bg-slate-900/25 border border-white/10 backdrop-blur-xl p-6 space-y-6 shadow-2xl"');

  c = c.replace('className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-[#0B0F19] border border-gray-800"',
    'className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10"');

  c = c.replace('className="w-full bg-[#0B0F19] border border-[#1F293D] rounded-xl p-3 text-lg font-bold font-mono text-white focus:outline-none focus:border-blue-500"',
    'className="w-full bg-white/[0.03] dark:bg-black/25 border border-white/10 rounded-xl p-3 text-lg font-bold font-mono text-white focus:outline-none focus:border-blue-500"');

  c = c.replace('className="p-4 rounded-2xl bg-[#0B0F19] border border-gray-800 space-y-2 text-xs font-mono"',
    'className="p-4 rounded-2xl bg-white/[0.02] dark:bg-black/20 border border-white/10 space-y-2 text-xs font-mono"');

  c = c.replace('border-t border-gray-800', 'border-t border-white/10');

  fs.writeFileSync(p, c, 'utf8');
  console.log('Updated trades/page.tsx');
}

// 2. payments/page.tsx
{
  const p = path.join(basePath, 'src/app/payments/page.tsx');
  let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

  c = c.replace('className="p-2 rounded-xl bg-[#161F33] text-gray-400 hover:text-white transition-colors"',
    'className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-gray-300 hover:text-white transition-colors"');

  c = c.replace('className="px-4 py-2 rounded-xl bg-[#161F33] border border-blue-500/20 text-xs text-blue-400 font-bold hover:bg-[#1E2B47] transition-all"',
    'className="px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-xs text-blue-400 font-bold transition-all"');

  // Top Wallet Balance Cards
  c = c.replace(/className=\"p-6 rounded-3xl bg-\[#111827\] border border-\[#1F293D\] space-y-2\"/g,
    'className="p-6 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl space-y-2"');

  // Left form
  c = c.replace('className="lg:col-span-7 rounded-3xl bg-[#111827] border border-[#1F293D] p-7 space-y-6"',
    'className="lg:col-span-7 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl p-7 space-y-6"');

  c = c.replace('selectedMethod === method.id \n                      ? "bg-[#161F33] border-blue-500 shadow-md" \n                      : "bg-[#0B0F19] border-gray-800 hover:border-gray-700"',
    'selectedMethod === method.id \n                      ? "bg-blue-600/20 border-blue-500/60 shadow-md" \n                      : "bg-white/[0.02] dark:bg-black/20 border-white/10 hover:border-blue-500/30"');

  c = c.replace('className="w-full bg-[#0B0F19] border border-[#1F293D] rounded-xl p-3 text-xl font-bold font-mono text-white focus:outline-none focus:border-blue-500"',
    'className="w-full bg-white/[0.03] dark:bg-black/25 border border-white/10 rounded-xl p-3 text-xl font-bold font-mono text-white focus:outline-none focus:border-blue-500"');

  // Right recent txs
  c = c.replace('className="lg:col-span-5 rounded-3xl bg-[#111827] border border-[#1F293D] p-7 space-y-5"',
    'className="lg:col-span-5 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl p-7 space-y-5"');

  c = c.replace(/className=\"p-3 bg-\[#0B0F19\] rounded-xl border border-gray-800 space-y-1\"/g,
    'className="p-3 bg-white/[0.02] dark:bg-black/20 rounded-xl border border-white/10 space-y-1"');

  fs.writeFileSync(p, c, 'utf8');
  console.log('Updated payments/page.tsx');
}
