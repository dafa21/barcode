import re

with open('office_admin_dashboard_copy3.txt', 'r') as f:
    code = f.read()

# Add items per page selector
pagination_selector = """          {/* Pagination Controls */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Show:</span>
              <select 
                value={itemsPerPage} 
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-xs border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
                <option value={96}>96</option>
              </select>
            </div>
          {totalPages > 1 && (
"""
code = code.replace("          {/* Pagination Controls */}\n          {totalPages > 1 && (", pagination_selector)

# Fix closing brackets for pagination
code = code.replace("            </div>\n          )}", "            </div>\n          )}\n          </div>")

# Add Detail button
detail_button = """         <button onClick={() => {
            const rsvpUrl = `${getBaseUrl()}/rsvp/${guest.barcodeUid}`;"""
new_detail_button = """         <button onClick={() => setSelectedGuestDetail(guest)} className="inline-flex items-center justify-center py-1.5 px-3 bg-indigo-50 text-indigo-700 rounded border border-indigo-100 hover:bg-indigo-100 transition-colors ml-auto text-[10px] font-bold uppercase tracking-widest shadow-sm">
           Detail
         </button>
         <button onClick={() => {
            const rsvpUrl = `${getBaseUrl()}/rsvp/${guest.barcodeUid}`;"""
code = code.replace(detail_button, new_detail_button)

# Implement detail view rendering
# We need to wrap the whole guests view logic.
# Wait, let's find the start of the guests view:
# {activeTab === 'guests' && (
guests_start = code.find("{activeTab === 'guests' && (")
guests_end = code.find("      {isEditEventModalOpen && (")

guests_jsx = code[guests_start:guests_end]
# Replace {activeTab === 'guests' && ( ... with ...
new_guests_jsx = guests_jsx.replace(
"""        {activeTab === 'guests' && (
<div className="flex flex-col gap-6 h-full">""",
"""        {activeTab === 'guests' && (
<div className="flex flex-col gap-6 h-full">
            {selectedGuestDetail ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedGuestDetail(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">Detail Tamu</h2>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">Informasi Pribadi</h3>
                      <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Nama Lengkap</p>
                          <p className="font-semibold text-gray-900">{selectedGuestDetail.guestName} {selectedGuestDetail.isVip && <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200"><Crown className="w-3 h-3"/> VIP</span>}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Email</p>
                            <p className="text-sm text-gray-900">{selectedGuestDetail.email || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">No. Telepon (WhatsApp)</p>
                            <p className="text-sm text-gray-900">{selectedGuestDetail.phone || '-'}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Perusahaan/Instansi</p>
                            <p className="text-sm text-gray-900">{selectedGuestDetail.company || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Jabatan</p>
                            <p className="text-sm text-gray-900">{selectedGuestDetail.jobTitle || '-'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">Status Kehadiran</h3>
                      <div className="bg-gray-50 p-4 rounded-xl space-y-4 border border-gray-100">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-700">Status Check-in</p>
                          {selectedGuestDetail.status === 'attended' ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
                              Attended
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              Not Checked In
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-700">RSVP Status</p>
                          {selectedGuestDetail.rsvpStatus === 'attending' ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">Hadir</span>
                          ) : selectedGuestDetail.rsvpStatus === 'not_attending' ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-red-50 text-red-600 border border-red-200">Tidak Hadir</span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">Menunggu</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-700">Waktu Scan Barcode</p>
                          <p className="text-sm text-gray-600">{selectedGuestDetail.scannedAt ? new Date(selectedGuestDetail.scannedAt).toLocaleString('id-ID') : '-'}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-700">Jumlah Pax</p>
                          <p className="text-sm font-bold text-gray-900">{selectedGuestDetail.paxCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-64 shrink-0 flex flex-col items-center">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3 w-full text-left">Barcode (QR Code)</h3>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center w-full">
                      <QRCodeSVG value={selectedGuestDetail.barcodeUid} size={150} />
                      <p className="mt-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Barcode UID</p>
                      <p className="text-xs font-mono text-indigo-600 truncate w-full text-center">{selectedGuestDetail.barcodeUid}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2 w-full mt-4">
                      <button onClick={() => handlePrintBarcode(selectedGuestDetail.barcodeUid, selectedGuestDetail.guestName)} className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                        <Download className="w-4 h-4" /> Download Barcode
                      </button>
                      {selectedGuestDetail.status !== 'attended' && (
                        <button onClick={() => {
                          handleManualCheckIn(selectedGuestDetail.barcodeUid);
                          setSelectedGuestDetail(prev => prev ? {...prev, status: 'attended', scannedAt: new Date().toISOString()} : null);
                        }} className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 border border-transparent rounded-xl text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Check In Manual
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : ("""
)

# Replace the closing logic
# There is a lot of nesting in the guests div, we need to find the correct closing.
# The end marker:
#               </div>
#             )}
#           </div>
#         )}
#       </div>

old_closing = """                </div>
              )}
            </div>"""
new_closing = """                </div>
              )}
            </div>
            )}"""

new_guests_jsx = new_guests_jsx.replace(old_closing, new_closing)
code = code.replace(guests_jsx, new_guests_jsx)

# Also let's ensure resetting selectedGuestDetail when changing tab or event
effect_str = """
  // Reset page when event changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedGuestDetail(null);
  }, [selectedEvent?.id, searchQuery, statusFilter]);
"""

code = code.replace("""  // Pagination
  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);""", effect_str + """  // Pagination
  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);""")

with open('src/components/OfficeAdminDashboard.tsx', 'w') as f:
    f.write(code)
print("done")
