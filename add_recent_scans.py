import sys

def modify_scanner(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # 1. Update imports
    old_imports = "import { ArrowLeft, CheckCircle2, XCircle, QrCode, Camera } from 'lucide-react';"
    new_imports = "import { ArrowLeft, CheckCircle2, XCircle, QrCode, Camera, Clock } from 'lucide-react';\n\ninterface RecentScan {\n  id: string;\n  name: string;\n  time: string;\n}"
    content = content.replace(old_imports, new_imports)

    # 2. Add state
    old_state = "  const [useCamera, setUseCamera] = useState(false);"
    new_state = "  const [useCamera, setUseCamera] = useState(false);\n  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);"
    content = content.replace(old_state, new_state)

    # 3. Update handleScanValue
    old_success = """      if (res.ok) {
        setStatus('success');
        setMessage(`Berhasil! Welcome, ${data.guest.guestName}`);
      } else {"""
    new_success = """      if (res.ok) {
        setStatus('success');
        setMessage(`Berhasil! Welcome, ${data.guest.guestName}`);
        setRecentScans(prev => {
          const newScan = {
            id: data.guest.id,
            name: data.guest.guestName,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          };
          return [newScan, ...prev].slice(0, 5);
        });
      } else {"""
    content = content.replace(old_success, new_success)

    # 4. Add UI part
    old_ui = """          <form onSubmit={handleScanForm} className="opacity-0 h-0 overflow-hidden">
            <input
              ref={inputRef}
              type="text"
              value={barcode}
              onChange={e => setBarcode(e.target.value)}
              autoFocus
              className="w-full"
              autoComplete="off"
            />
          </form>
        </div>
      </main>"""
    new_ui = """          <form onSubmit={handleScanForm} className="opacity-0 h-0 overflow-hidden">
            <input
              ref={inputRef}
              type="text"
              value={barcode}
              onChange={e => setBarcode(e.target.value)}
              autoFocus
              className="w-full"
              autoComplete="off"
            />
          </form>
        </div>
        
        {/* Recent Scans List */}
        <div className="w-full max-w-md mt-8 z-10">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
              <Clock className="w-3 h-3" /> Recent Scans
            </h3>
            {recentScans.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No recent scans</p>
            ) : (
              <ul className="space-y-3">
                {recentScans.map((scan, idx) => (
                  <li key={`${scan.id}-${idx}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{scan.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{scan.time}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>"""
    content = content.replace(old_ui, new_ui)

    with open(filepath, "w") as f:
        f.write(content)

modify_scanner("src/components/Scanner.tsx")
