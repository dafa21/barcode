import sys

def replace_responsive(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Update handleScanValue logic
    old_scan = """  const handleScanValue = async (scannedUid: string) => {
    if (!scannedUid.trim()) return;"""
    
    new_scan = """  const handleScanValue = async (scannedUid: string) => {
    if (!scannedUid.trim() || status !== 'idle') return;"""
    
    content = content.replace(old_scan, new_scan)
    
    # Remove setUseCamera(false) and adjust timeout
    old_timeout = """      setTimeout(() => {
        setStatus('idle');
        setMessage('');
        setUseCamera(false);
      }, 3000);"""
      
    new_timeout = """      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 2000);"""
      
    content = content.replace(old_timeout, new_timeout)
    
    # Add success/error overlays inside useCamera
    old_camera = """            {useCamera ? (
              <div className="w-full h-64 max-w-sm mx-auto overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm relative">
                <QrScanner
                  onDecode={(result) => handleScanValue(result)}
                  onError={(error) => console.log(error?.message)}
                />
              </div>"""
              
    new_camera = """            {useCamera ? (
              <div className="w-full h-64 max-w-sm mx-auto overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm relative">
                <QrScanner
                  onDecode={(result) => handleScanValue(result)}
                  onError={(error) => console.log(error?.message)}
                />
                {status === 'success' && (
                  <div className="absolute inset-0 bg-emerald-500/95 flex flex-col items-center justify-center z-10 text-white p-6 backdrop-blur-sm transition-all duration-300">
                    <CheckCircle2 className="w-16 h-16 mb-4" />
                    <p className="text-xl font-bold text-center leading-tight">{message}</p>
                  </div>
                )}
                {status === 'error' && (
                  <div className="absolute inset-0 bg-red-500/95 flex flex-col items-center justify-center z-10 text-white p-6 backdrop-blur-sm transition-all duration-300">
                    <XCircle className="w-16 h-16 mb-4" />
                    <p className="text-xl font-bold text-center leading-tight">{message}</p>
                  </div>
                )}
                {status === 'scanning' && (
                  <div className="absolute inset-0 bg-indigo-500/95 flex flex-col items-center justify-center z-10 text-white p-6 backdrop-blur-sm transition-all duration-300">
                    <QrCode className="w-16 h-16 mb-4 animate-pulse" />
                    <p className="text-xl font-bold text-center leading-tight">Processing...</p>
                  </div>
                )}
              </div>"""
              
    content = content.replace(old_camera, new_camera)
    
    # Update success message to match user request "berhasil"
    content = content.replace(
        "setMessage(`Welcome, ${data.guest.guestName}!`);",
        "setMessage(`Berhasil! Welcome, ${data.guest.guestName}`);"
    )

    with open(filepath, "w") as f:
        f.write(content)

replace_responsive("src/components/Scanner.tsx")
