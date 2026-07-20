import re

with open('office_admin_dashboard_copy.txt', 'r') as f:
    code = f.read()

# 1. Update activeTab state definition
code = code.replace("useState<'events' | 'analytics' | 'pics'>('events')", "useState<'events' | 'guests' | 'analytics' | 'pics'>('events')")

# 2. Extract the Events List JSX
events_list_start = code.find('<div className="col-span-12 lg:col-span-4 flex flex-col gap-4">')
events_list_end = code.find('          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">')

events_list_jsx = code[events_list_start:events_list_end]
events_list_jsx = events_list_jsx.replace('<div className="col-span-12 lg:col-span-4 flex flex-col gap-4">', '<div className="flex flex-col gap-4 h-full">')
events_list_jsx = events_list_jsx.replace('lg:h-[calc(100vh-12rem)]', 'h-full')

# 3. Extract the Guests List JSX
guests_list_start = events_list_end
guests_list_end = code.find('              ) : (\n                <div className="h-full')

guests_list_jsx = code[guests_list_start:guests_list_end]
guests_list_jsx = guests_list_jsx.replace('<div className="col-span-12 lg:col-span-8 flex flex-col gap-6">', '<div className="flex flex-col gap-6 h-full">')

# Wait, we need the closing tags for guests_list_jsx.
# Instead of slicing, let's just use guests_list_jsx up to the end of the `) : (` block?
# Let's see: `selectedEvent ? ( ... ) : ( ... )`
guests_full_start = code.find('{selectedEvent ? (')
guests_full_end = code.find('      </div>\n    \n      {isEditEventModalOpen && (')
# Wait, guests_full_end is at the end of the wrapper div.
# Let's extract the exact guest list JSX:
guests_list_jsx = code[events_list_end : guests_full_end]
guests_list_jsx = guests_list_jsx.replace('<div className="col-span-12 lg:col-span-8 flex flex-col gap-6">', '<div className="flex flex-col gap-6 h-full">')
guests_list_jsx = guests_list_jsx.replace('          </div>\n        )}\n', '') # Remove the wrapping from activeTab condition

# Fix table to cards in guests_list_jsx
table_start = guests_list_jsx.find('<table className="min-w-full divide-y divide-gray-200">')
table_end = guests_list_jsx.find('</table>') + len('</table>')

table_jsx = guests_list_jsx[table_start:table_end]
cards_jsx = """
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
  {filteredGuests.map(guest => (
    <div key={guest.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 relative">
      <div className="absolute top-4 right-4">
        <input
          type="checkbox"
          className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 disabled:opacity-50"
          checked={selectedGuestIds.includes(guest.id)}
          onChange={() => toggleSelectGuest(guest.id)}
          disabled={guest.status === 'attended' || !guest.phone}
        />
      </div>
      <div className="pr-8">
        <h3 className="font-bold text-gray-900 text-sm">{guest.guestName} {guest.isVip && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200"><Crown className="w-3 h-3"/> VIP</span>}</h3>
        <p className="text-xs text-gray-500 mt-1">{guest.email || 'No email'} {guest.phone ? `• ${guest.phone}` : '• No phone'}</p>
        {guest.company && <p className="text-xs text-gray-500 mt-0.5">{guest.company} {guest.jobTitle && `- ${guest.jobTitle}`}</p>}
      </div>
      
      <div className="flex items-center gap-2 mt-1">
        <div className="bg-indigo-50 p-1.5 rounded-lg shrink-0">
          <QRCodeSVG value={guest.barcodeUid} size={24} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Barcode UID</p>
          <p className="text-xs font-mono text-indigo-600 truncate">{guest.barcodeUid}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mt-auto pt-3 border-t border-gray-100">
        {guest.status === 'attended' ? (
          <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
            Attended
          </span>
        ) : (
          <button
            onClick={() => handleManualCheckIn(guest.barcodeUid)}
            className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-sm"
          >
            Check In
          </button>
        )}
        
        {guest.rsvpStatus === 'attending' ? (
          <div className="flex flex-col">
            <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-200">Hadir</span>
          </div>
        ) : guest.rsvpStatus === 'not_attending' ? (
          <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-red-50 text-red-600 border border-red-200">Tidak Hadir</span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-200">Menunggu</span>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-1.5 mt-2">
         {guest.rsvpStatus === 'attending' && !guest.isPrinted && (
           <button onClick={() => setPrintingGuest(guest)} className="inline-flex items-center justify-center p-1.5 bg-gray-50 text-gray-600 rounded border border-gray-200 hover:bg-white hover:text-indigo-600 transition-colors" title="Print ID Card">
             <Printer className="w-3.5 h-3.5" />
           </button>
         )}
         <button onClick={() => handleGenerateBarcode(guest.barcodeUid, guest.guestName)} className="inline-flex items-center justify-center p-1.5 bg-gray-50 text-gray-600 rounded border border-gray-200 hover:bg-white hover:text-indigo-600 transition-colors" title="Download Barcode">
            <Download className="w-3.5 h-3.5" />
         </button>
         <button onClick={() => {
            const rsvpUrl = `${getBaseUrl()}/rsvp/${guest.barcodeUid}`;
            const fileUrl = `${getBaseUrl()}/api/events/public/invitation/${selectedEvent?.slug}`;
            const eventDateStr = new Date(selectedEvent?.eventDate || '').toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const eventTimeStr = new Date(selectedEvent?.eventDate || '').toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            
            const message = guest.rsvpStatus === 'attending' 
              ? `*Tiket Resmi Acara* 🎟️\n\nKepada Yth.\n*Bapak/Ibu ${guest.guestName}*\n\nTerima kasih telah mengonfirmasi kehadiran Anda pada acara *${selectedEvent?.eventName}*.\n\nBerikut adalah tautan tiket Barcode (QR Code) Anda. Mohon tunjukkan tiket ini kepada petugas registrasi saat tiba di lokasi acara:\n\n🔗 *Tautan Tiket:*\n${rsvpUrl}\n\nKami menantikan kehadiran Anda pada:\n📅 *Hari/Tanggal:* ${eventDateStr}\n⏰ *Waktu:* ${eventTimeStr}\n📍 *Lokasi:* ${selectedEvent?.location || 'Akan diinformasikan'}\n\nSampai jumpa di acara!\n\nHormat kami,\n*Panitia Penyelenggara*`
              : `*Undangan Resmi Acara* ✉️\n\nKepada Yth.\n*Bapak/Ibu ${guest.guestName}*\n\nDengan hormat,\n\nMelalui pesan ini, kami bermaksud mengundang Bapak/Ibu untuk berkenan hadir pada acara *${selectedEvent?.eventName}* yang akan diselenggarakan pada:\n\n📅 *Hari/Tanggal:* ${eventDateStr}\n⏰ *Waktu:* ${eventTimeStr}\n📍 *Lokasi:* ${selectedEvent?.location || 'Akan diinformasikan'}\n\n📎 *Tautan File Undangan Resmi:*\n${fileUrl}\n\nMengingat pentingnya acara ini, kami sangat mengharapkan kehadiran Bapak/Ibu. Untuk kelancaran persiapan acara, mohon berkenan memberikan konfirmasi kehadiran (RSVP) melalui sistem registrasi kami pada tautan di bawah ini:\n\n🔗 *Tautan Konfirmasi Kehadiran (RSVP):*\n${rsvpUrl}\n\nSetelah Bapak/Ibu melakukan konfirmasi kehadiran melalui tautan di atas, sistem akan secara otomatis menerbitkan Kartu Identitas Tamu (ID Card) beserta QR Code sebagai tiket akses masuk resmi Bapak/Ibu.\n\nDemikian undangan ini kami sampaikan. Atas perhatian dan perkenan Bapak/Ibu, kami mengucapkan terima kasih yang sebesar-besarnya.\n\nHormat kami,\n\n*Panitia Penyelenggara*`;
            
            window.open(`https://wa.me/${guest.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
         }} disabled={!guest.phone} className="inline-flex items-center justify-center p-1.5 bg-gray-50 text-gray-600 rounded border border-gray-200 hover:bg-white hover:text-green-600 transition-colors disabled:opacity-50" title={guest.rsvpStatus === 'attending' ? 'Kirim Tiket Barcode WA' : 'Kirim Link Konfirmasi RSVP WA'}>
            <MessageCircle className="w-3.5 h-3.5" />
         </button>
         <button onClick={() => handleDeleteGuest(guest.id)} className="inline-flex items-center justify-center p-1.5 bg-gray-50 text-gray-600 rounded border border-gray-200 hover:bg-white hover:text-red-600 transition-colors ml-auto" title="Delete Guest">
            <Trash2 className="w-3.5 h-3.5" />
         </button>
      </div>
    </div>
  ))}
</div>
"""
guests_list_jsx = guests_list_jsx.replace(table_jsx, cards_jsx)

# Clean up any leftover div wrapping that might have been sliced
# Wait, guests_list_jsx ends with:
#               )}
#             </div>
#           </div>
# This is well formed for what we need if we removed the parent wrapping from activeTab conditional.
# Wait, the string was:
#           </div>
#         )}
#       </div>
guests_list_jsx = guests_list_jsx.replace('          </div>\n        )}\n      </div>', '          </div>\n')

# 4. Now reconstruct the full return statement
new_return = f"""  return (
    <>
    <div className="flex flex-col md:flex-row h-full min-h-[calc(100vh-5rem)] bg-white">
      {{/* Sidebar */}}
      <div className="w-full md:w-64 shrink-0 border-r border-gray-200 p-4 flex flex-col gap-2 bg-gray-50 overflow-y-auto">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-3">Main Menu</h3>
        <button
          onClick={{() => setActiveTab('events')}}
          className={{`px-4 py-3 text-left text-sm font-semibold uppercase tracking-widest rounded-xl transition-colors ${{
            activeTab === 'events' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
          }}`}}
        >
          <div className="flex items-center gap-3">
             <Calendar className="w-4 h-4" />
             Event Management
          </div>
        </button>
        <button
          onClick={{() => setActiveTab('guests')}}
          className={{`px-4 py-3 text-left text-sm font-semibold uppercase tracking-widest rounded-xl transition-colors ${{
            activeTab === 'guests' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
          }}`}}
        >
          <div className="flex items-center gap-3">
             <Users className="w-4 h-4" />
             Daftar Tamu
          </div>
        </button>
        <button
          onClick={{() => setActiveTab('analytics')}}
          className={{`px-4 py-3 text-left text-sm font-semibold uppercase tracking-widest rounded-xl transition-colors ${{
            activeTab === 'analytics' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
          }}`}}
        >
          <div className="flex items-center gap-3">
             <Activity className="w-4 h-4" />
             Analytics
          </div>
        </button>
      </div>

      {{/* Main Content */}}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col min-w-0 bg-white">
        {{activeTab === 'analytics' && <AnalyticsDashboard />}}
        {{activeTab === 'events' && (
          {events_list_jsx}
        )}}
        {{activeTab === 'guests' && (
          {guests_list_jsx}
        )}}
      </div>
    </div>
"""

old_return_start = code.find('  return (\n    <>\n    <div className="flex flex-col gap-6 h-full">')
old_return_end = code.find('      </div>\n    \n      {isEditEventModalOpen && (')

new_code = code[:old_return_start] + new_return + code[old_return_end:]
new_code = new_code.replace("activeTab === 'dashboard'", "activeTab === 'analytics'")
new_code = new_code.replace("setActiveTab('dashboard')", "setActiveTab('analytics')")

with open('src/components/OfficeAdminDashboard.tsx', 'w') as f:
    f.write(new_code)
print("Done")
