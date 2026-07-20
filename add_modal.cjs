const fs = require('fs');
let code = fs.readFileSync('src/components/OfficeAdminDashboard.tsx', 'utf8');

const endOfFileIdx = code.lastIndexOf('</div>');
if (endOfFileIdx === -1) {
  console.log("Could not find end of file.");
  process.exit(1);
}

const modalHTML = `
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsRegisterModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Register Identity
              </h3>
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddGuest} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Guest Name</label>
                  <input
                    type="text"
                    required
                    value={newGuestName}
                    onChange={e => setNewGuestName(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 py-2.5 px-3"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Email (Optional)</label>
                  <input
                    type="email"
                    value={newGuestEmail}
                    onChange={e => setNewGuestEmail(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 py-2.5 px-3"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">WhatsApp Number (Optional)</label>
                  <input
                    type="tel"
                    value={newGuestPhone}
                    onChange={e => setNewGuestPhone(e.target.value)}
                    placeholder="e.g. +628123456789"
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 py-2.5 px-3"
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-[10px] font-bold uppercase tracking-widest mt-4 shadow-md border border-indigo-500/50">
                  Generate Barcode
                </button>
              </form>
              
              {generatedBarcode && (
                <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-xl flex flex-col items-center text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <QrCode className="w-24 h-24" />
                  </div>
                  <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-900 mb-2">{generatedBarcode.name}</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-6">Identity Registered</p>
                  
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-4 relative z-10">
                    <QRCodeSVG 
                      value={generatedBarcode.uid} 
                      size={160}
                      level="H"
                      fgColor="#111827"
                      bgColor="#ffffff"
                    />
                  </div>
                  
                  <p className="text-xs font-mono text-indigo-600 bg-indigo-100/50 px-3 py-1 rounded-full border border-indigo-200">
                    {generatedBarcode.uid}
                  </p>
                  
                  <button 
                    onClick={() => {
                      setGeneratedBarcode(null);
                      setIsRegisterModalOpen(false);
                    }}
                    className="mt-6 w-full py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 border border-gray-200 hover:bg-gray-100 bg-white shadow-sm rounded-lg transition-colors relative z-10"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
`;

code = code.substring(0, endOfFileIdx) + modalHTML + code.substring(endOfFileIdx);
fs.writeFileSync('src/components/OfficeAdminDashboard.tsx', code);
console.log("Successfully added modal.");
