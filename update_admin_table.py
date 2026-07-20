import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Table Header
    old_th = """                              <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                              <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Scanned At</th>"""
    new_th = """                              <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                              <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">RSVP</th>
                              <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Scanned At</th>"""
    content = content.replace(old_th, new_th)

    # Table Row
    old_td = """                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {guest.scannedAt ? new Date(guest.scannedAt).toLocaleString() : '-'}
                                </td>"""
    new_td = """                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {guest.rsvpStatus === 'attending' ? (
                                    <div className="flex flex-col">
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 w-fit">Hadir</span>
                                      <span className="text-[10px] text-gray-400 mt-1">{guest.paxCount} Pax</span>
                                    </div>
                                  ) : guest.rsvpStatus === 'not_attending' ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-600 border border-red-200">Tidak Hadir</span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">Menunggu</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {guest.scannedAt ? new Date(guest.scannedAt).toLocaleString() : '-'}
                                </td>"""
    content = content.replace(old_td, new_td)

    # Button logic
    old_btn = """                                        onClick={() => {
                                          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${guest.barcodeUid}`;
                                          const message = `Yth. Bapak/Ibu ${guest.guestName},\\n\\nKami dengan hormat mengundang Bapak/Ibu untuk hadir pada acara *${selectedEvent.eventName}* yang akan diselenggarakan pada:\\n\\nWaktu: ${new Date(selectedEvent.eventDate).toLocaleString()}\\nLokasi: ${selectedEvent.location || 'Akan diinformasikan'}\\n\\nUntuk kemudahan proses registrasi dan akses masuk, mohon berkenan menunjukkan QR Code pada tautan di bawah ini atau menyebutkan Kode Kehadiran kepada petugas kami di lokasi:\\n\\n🔗 Tautan QR Code: ${qrUrl}\\n📝 Kode UID: *${guest.barcodeUid}*\\n\\nKehadiran Bapak/Ibu sangat berarti bagi kami. Atas perhatian dan perkenannya, kami ucapkan terima kasih.\\n\\nHormat kami,\\nPanitia Acara`;
                                          const phoneStr = guest.phone.replace(/[^0-9]/g, '');
                                          const formattedPhone = phoneStr.startsWith('0') ? '62' + phoneStr.slice(1) : phoneStr;
                                          window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
                                        }}
                                        className="text-gray-400 hover:text-emerald-500 transition-colors"
                                        title="Kirim Undangan WA"
                                      >
                                        <MessageCircle className="w-4 h-4" />
                                      </button>"""
    
    new_btn = """                                        onClick={() => {
                                          const phoneStr = guest.phone.replace(/[^0-9]/g, '');
                                          const formattedPhone = phoneStr.startsWith('0') ? '62' + phoneStr.slice(1) : phoneStr;
                                          
                                          if (guest.rsvpStatus === 'attending') {
                                            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${guest.barcodeUid}`;
                                            const message = `Yth. Bapak/Ibu ${guest.guestName},\\n\\nTerima kasih atas konfirmasi kehadiran Bapak/Ibu pada acara *${selectedEvent.eventName}*.\\n\\nUntuk kemudahan proses registrasi dan akses masuk di lokasi, mohon berkenan menunjukkan QR Code pada tautan di bawah ini atau menyebutkan Kode Kehadiran kepada petugas kami:\\n\\n🔗 Tautan QR Code: ${qrUrl}\\n📝 Kode UID: *${guest.barcodeUid}*\\n\\nKami menantikan kehadiran Bapak/Ibu.\\n\\nHormat kami,\\nPanitia Acara`;
                                            window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
                                          } else {
                                            const rsvpUrl = `${window.location.origin}/rsvp/${guest.barcodeUid}`;
                                            const message = `Yth. Bapak/Ibu ${guest.guestName},\\n\\nKami dengan hormat mengundang Bapak/Ibu untuk hadir pada acara *${selectedEvent.eventName}* yang akan diselenggarakan pada:\\n\\nWaktu: ${new Date(selectedEvent.eventDate).toLocaleString()}\\nLokasi: ${selectedEvent.location || 'Akan diinformasikan'}\\n\\nMohon berkenan untuk memberikan konfirmasi kehadiran Bapak/Ibu melalui tautan berikut:\\n🔗 ${rsvpUrl}\\n\\nSetelah Bapak/Ibu melakukan konfirmasi kehadiran, kami akan mengirimkan tiket barcode akses masuk secara otomatis.\\n\\nKehadiran Bapak/Ibu sangat berarti bagi kami. Atas perhatian dan perkenannya, kami ucapkan terima kasih.\\n\\nHormat kami,\\nPanitia Acara`;
                                            window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
                                          }
                                        }}
                                        className={`transition-colors ${guest.rsvpStatus === 'attending' ? 'text-emerald-500 hover:text-emerald-600' : 'text-gray-400 hover:text-indigo-600'}`}
                                        title={guest.rsvpStatus === 'attending' ? 'Kirim Tiket Barcode WA' : 'Kirim Link Konfirmasi RSVP WA'}
                                      >
                                        <MessageCircle className="w-4 h-4" />
                                      </button>"""
    
    content = content.replace(old_btn, new_btn)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
