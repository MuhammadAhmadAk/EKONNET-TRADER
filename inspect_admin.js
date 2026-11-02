const fs = require('fs');
const page = fs.readFileSync('D:/Ekonnet/EKONNET-TRADER/src/app/admin/page.tsx', 'utf8');

const checkBlocks = [
  '{activeNav === "reserves" && (',
  '{activeNav === "kyc" && (',
  '{activeNav === "permissions" && (',
  '{activeNav === "tickets" && (',
  '{activeNav === "audit" && (',
  '{activeNav === "settings" && ('
];

checkBlocks.forEach(b => {
  const idx = page.indexOf(b);
  if (idx !== -1) {
    console.log('=== ' + b + ' ===');
    console.log(page.slice(idx, idx + 250));
  }
});
