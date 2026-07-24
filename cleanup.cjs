const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'OfficeAdminDashboard.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Upgrade Event Card
content = content.replace(
  "w-full text-left p-5 rounded-2xl border transition-all duration-300 group",
  "w-full text-left p-6 rounded-2xl border transition-all duration-300 group flex flex-col gap-2 relative overflow-hidden"
);

// Add a decorative left border to the active event card
content = content.replace(
  "'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-md ring-1 ring-indigo-500/20'",
  "'bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border-indigo-200 shadow-md ring-1 ring-indigo-500/20 border-l-4 border-l-indigo-600'"
);

// 2. Upgrade Guest Card container
content = content.replace(
  "bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 relative",
  "bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 relative overflow-hidden group"
);

// 3. Upgrade Guest Card Action Buttons
content = content.replace(
  /className="inline-flex items-center justify-center py-1.5 px-3 bg-indigo-50 text-indigo-700 rounded border border-indigo-100 hover:bg-indigo-100 transition-colors ml-auto text-\[10px\] font-bold uppercase tracking-widest shadow-sm"/g,
  `className="inline-flex items-center justify-center py-1.5 px-3 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors ml-auto text-[10px] font-bold uppercase tracking-widest shadow-sm"`
);

// Clean up some button shapes in Guest Card (from rounded to rounded-lg for more modern look)
content = content.replace(/rounded border border-gray-200/g, "rounded-lg border border-gray-200");
content = content.replace(/rounded border border-amber-200/g, "rounded-lg border border-amber-200");
content = content.replace(/rounded border border-red-200/g, "rounded-lg border border-red-200");
content = content.replace(/rounded border border-indigo-200/g, "rounded-lg border border-indigo-200");
content = content.replace(/rounded border border-emerald-200/g, "rounded-lg border border-emerald-200");

// Update color scheme from Indigo/Purple to Emerald/Teal to match Laznas Dewan Dakwah
content = content.replace(/indigo/g, "emerald");
content = content.replace(/purple/g, "teal");

// Replace Dashboard Sidebar colors
const dashFile = path.join(__dirname, 'src', 'components', 'Dashboard.tsx');
let dashContent = fs.readFileSync(dashFile, 'utf8');
dashContent = dashContent.replace(/indigo/g, "emerald");
dashContent = dashContent.replace(/purple/g, "teal");
fs.writeFileSync(dashFile, dashContent);

const superFile = path.join(__dirname, 'src', 'components', 'SuperAdminDashboard.tsx');
let superContent = fs.readFileSync(superFile, 'utf8');
superContent = superContent.replace(/indigo/g, "emerald");
superContent = superContent.replace(/purple/g, "teal");
fs.writeFileSync(superFile, superContent);


fs.writeFileSync(file, content);
console.log('UI cleanup applied');
