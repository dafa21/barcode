const fs = require('fs');
let code = fs.readFileSync('src/components/OfficeAdminDashboard.tsx', 'utf8');

const startStr = `<div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-8 overflow-y-auto flex-1">`;
const endStr = `<div className="xl:col-span-2 flex flex-col min-w-0">`;
const startIdx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr);

if (startIdx === -1 || endIdx === -1) {
  console.log("Could not find start or end strings.");
  process.exit(1);
}

const replacement = `<div className="p-6 flex flex-col gap-6 overflow-y-auto flex-1">
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-emerald-600" />
                          Live Check-ins
                        </h3>
                      </div>
                      <div className="flex gap-4 overflow-x-auto pb-4 mb-4">
                        {guests
                          .filter(g => g.status === 'attended' && g.scannedAt)
                          .sort((a, b) => new Date(b.scannedAt!).getTime() - new Date(a.scannedAt!).getTime())
                          .slice(0, 8)
                          .map(guest => (
                            <div key={guest.id} className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center justify-between min-w-[240px] flex-shrink-0">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{guest.guestName}</div>
                                <div className="text-[10px] text-gray-500 font-mono mt-0.5">{guest.barcodeUid.substring(0, 8)}</div>
                              </div>
                              <div className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md">
                                {new Date(guest.scannedAt!).toLocaleTimeString()}
                              </div>
                            </div>
                          ))
                        }
                        {guests.filter(g => g.status === 'attended').length === 0 && (
                          <div className="text-gray-400 text-xs italic py-2">No check-ins yet.</div>
                        )}
                      </div>
`;

code = code.substring(0, startIdx) + replacement + code.substring(endIdx + endStr.length);
fs.writeFileSync('src/components/OfficeAdminDashboard.tsx', code);
console.log("Successfully replaced layout.");
