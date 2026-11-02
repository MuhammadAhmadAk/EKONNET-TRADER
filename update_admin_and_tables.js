const fs = require('fs');
const path = require('path');

const basePath = 'D:/Ekonnet/EKONNET-TRADER';

// 1. src/app/admin/page.tsx
{
  const p = path.join(basePath, 'src/app/admin/page.tsx');
  let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

  // Sidebar styling: glass & translucent
  c = c.replace('shrink-0 bg-slate-950 border-r border-slate-800 flex flex-col justify-between z-40 select-none',
    'shrink-0 bg-slate-950/60 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between z-40 select-none');

  c = c.replace('border-b border-slate-800/80', 'border-b border-white/10');
  c = c.replace('p-3 border-t border-slate-800/80 bg-slate-900/50', 'p-3 border-t border-white/10 bg-transparent');
  c = c.replace('flex items-center gap-3 p-2 rounded-xl bg-slate-900 border border-slate-800',
    'flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/10');

  // Main container: transparent background
  c = c.replace('flex-1 flex flex-col h-screen overflow-hidden bg-slate-900/40',
    'flex-1 flex flex-col h-screen overflow-hidden bg-transparent');

  // Header: glass HUD
  c = c.replace('header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur px-6 flex items-center justify-between shrink-0 z-30"',
    'header className="h-16 border-b border-white/10 bg-slate-950/40 backdrop-blur-xl px-6 flex items-center justify-between shrink-0 z-30"');

  // Quick action badge in header
  c = c.replace('hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300',
    'hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300');

  // Flush cache button
  c = c.replace('className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"',
    'className="px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition"');

  // Replace chunky stat cards (p-4 rounded-2xl bg-slate-900/60 border border-slate-800)
  c = c.replace(/p-4 rounded-2xl bg-slate-900\/60 border border-slate-800 space-y-2/g,
    'p-5 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl space-y-2');

  // Service cluster card
  c = c.replace('p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4',
    'p-6 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl space-y-4');

  // Replace microservice inner boxes: p-3.5 rounded-xl bg-slate-950 border border-slate-800
  c = c.replace(/p-3\.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2/g,
    'p-4 rounded-2xl bg-white/[0.02] dark:bg-black/20 border border-white/10 space-y-2');

  // Recent Audit Stream card
  c = c.replace('p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3',
    'p-6 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl space-y-3');

  // Audit stream table header: bg-slate-950 text-slate-400
  c = c.replace('thead className="bg-slate-950 text-slate-400 uppercase text-[10px]"',
    'thead className="bg-white/[0.02] dark:bg-black/20 text-slate-400 uppercase text-[10px] border-b border-white/10"');

  // Users Table & all other table cards: rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden
  c = c.replace(/rounded-2xl bg-slate-900\/60 border border-slate-800 overflow-hidden/g,
    'rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl overflow-hidden');

  // Users table thead: bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800
  c = c.replace('thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800"',
    'thead className="bg-white/[0.02] dark:bg-black/20 text-slate-400 uppercase text-[10px] font-mono border-b border-white/10"');

  // Search input & tier dropdown in Users tab
  c = c.replace('rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-64',
    'rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 w-64');

  c = c.replace('rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none',
    'rounded-xl bg-white/[0.04] dark:bg-black/25 border border-white/10 text-xs text-slate-200 focus:outline-none');

  // Action buttons in tables: px-2 py-1 rounded bg-slate-800 hover:bg-slate-700
  c = c.replace(/px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-\[11px\] text-blue-400 transition/g,
    'px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-[11px] text-blue-400 border border-blue-500/20 transition');

  // Telemetry cards: p-5 rounded-2xl bg-slate-900/60 border border-slate-800
  c = c.replace(/p-5 rounded-2xl bg-slate-900\/60 border border-slate-800/g,
    'p-6 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl');

  // Replace divide-y divide-slate-800 with divide-y divide-white/5
  c = c.replace(/divide-y divide-slate-800/g, 'divide-y divide-white/5');

  // Replace hover:bg-slate-800/40 with hover:bg-white/[0.03]
  c = c.replace(/hover:bg-slate-800\/40/g, 'hover:bg-white/[0.03]');

  // Replace remaining bg-slate-950 boxes in tabs
  c = c.replace(/bg-slate-950 border border-slate-800/g, 'bg-white/[0.02] dark:bg-black/20 border border-white/10');

  fs.writeFileSync(p, c, 'utf8');
  console.log('Updated src/app/admin/page.tsx');
}

// 2. UserManagementTable.tsx
{
  const p = path.join(basePath, 'src/components/admin/UserManagementTable.tsx');
  let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

  // Replace chunky table card
  c = c.replace('className="rounded-3xl bg-[#111827] border border-[#1F293D] overflow-hidden shadow-2xl"',
    'className="rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl"');

  c = c.replace('className="p-6 border-b border-[#1F293D] flex items-center justify-between"',
    'className="p-6 border-b border-white/10 flex items-center justify-between"');

  // Thead
  c = c.replace('className="bg-[#0B0F19] border-b border-[#1F293D] text-gray-400 font-semibold uppercase tracking-wider text-[11px]"',
    'className="bg-white/[0.02] dark:bg-black/20 border-b border-white/10 text-gray-400 font-semibold uppercase tracking-wider text-[11px]"');

  // Rows
  c = c.replace(/className=\"hover:bg-\[#161F33\]\/60 transition-colors\"/g,
    'className="hover:bg-white/[0.03] transition-colors border-b border-white/5"');

  // Profile avatar: remove icon box container
  c = c.replace('<div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold font-mono text-blue-400 text-xs">',
    '<div className="w-8 h-8 flex items-center justify-center font-black font-mono text-cyan-400 text-xs">');

  // Buttons in actions
  c = c.replace(/className=\"p-1\.5 rounded-lg bg-\[#161F33\] hover:bg-\[#1E2B47\] text-blue-400 border border-gray-700 transition-colors\"/g,
    'className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-colors"');

  c = c.replace(/className=\"p-1\.5 rounded-lg bg-\[#161F33\] hover:bg-\[#1E2B47\] text-purple-400 border border-gray-700 transition-colors\"/g,
    'className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 transition-colors"');

  // Internal Staff Notes Drawer
  c = c.replace('className="p-6 rounded-3xl bg-[#111827] border-2 border-purple-500/40 shadow-2xl space-y-5"',
    'className="p-6 rounded-3xl bg-white/[0.03] dark:bg-slate-900/30 border border-purple-500/30 backdrop-blur-xl shadow-2xl space-y-5"');

  c = c.replace('className="flex items-center justify-between pb-3 border-b border-[#1F293D]"',
    'className="flex items-center justify-between pb-3 border-b border-white/10"');

  c = c.replace('className="w-full bg-[#0B0F19] border border-[#1F293D] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"',
    'className="w-full bg-white/[0.03] dark:bg-black/25 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500/50"');

  c = c.replace(/className=\"p-3\.5 rounded-2xl bg-\[#0B0F19\] border border-gray-800 space-y-1\.5 text-xs\"/g,
    'className="p-3.5 rounded-2xl bg-white/[0.02] dark:bg-black/20 border border-white/10 space-y-1.5 text-xs"');

  fs.writeFileSync(p, c, 'utf8');
  console.log('Updated src/components/admin/UserManagementTable.tsx');
}

// 3. Update remaining admin components
const adminCompDir = path.join(basePath, 'src/components/admin');
fs.readdirSync(adminCompDir).forEach(file => {
  if (file === 'UserManagementTable.tsx') return;
  const fp = path.join(adminCompDir, file);
  let c = fs.readFileSync(fp, 'utf8').replace(/\r\n/g, '\n');

  c = c.replace(/bg-\[#111827\]/g, 'bg-white/[0.02] dark:bg-slate-900/20 backdrop-blur-xl');
  c = c.replace(/bg-\[#0B0F19\]/g, 'bg-white/[0.02] dark:bg-black/20');
  c = c.replace(/bg-\[#161F33\]/g, 'bg-white/[0.04]');
  c = c.replace(/border-\[#1F293D\]/g, 'border-white/10');
  c = c.replace(/bg-slate-950/g, 'bg-slate-950/60 backdrop-blur-xl');
  c = c.replace(/bg-slate-900\/60 border border-slate-800/g, 'bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl');

  fs.writeFileSync(fp, c, 'utf8');
  console.log('Cleaned admin component:', file);
});
