import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # The existing code is:
    # const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${guest.barcodeUid}`;
    # const message = `Yth. Bapak/Ibu ${guest.guestName},\n\nTerima kasih atas konfirmasi kehadiran Bapak/Ibu pada acara *${selectedEvent.eventName}*.\n\nUntuk kemudahan proses registrasi dan akses masuk di lokasi, mohon berkenan menunjukkan QR Code pada tautan di bawah ini atau menyebutkan Kode Kehadiran kepada petugas kami:\n\n🔗 Tautan QR Code: ${qrUrl}\n📝 Kode UID: *${guest.barcodeUid}*\n\nKami menantikan kehadiran Bapak/Ibu.\n\nHormat kami,\nPanitia Acara`;
    
    # And:
    # const rsvpUrl = `${window.location.origin}/rsvp/${guest.barcodeUid}`;
    # const message = `Yth. Bapak/Ibu ${guest.guestName},\n\nKami dengan hormat mengundang Bapak/Ibu untuk hadir pada acara *${selectedEvent.eventName}* yang akan diselenggarakan pada:\n\nWaktu: ${new Date(selectedEvent.eventDate).toLocaleString()}\nLokasi: ${selectedEvent.location || 'Akan diinformasikan'}\n\nMohon berkenan untuk memberikan konfirmasi kehadiran Bapak/Ibu melalui tautan berikut:\n🔗 ${rsvpUrl}\n\nSetelah Bapak/Ibu melakukan konfirmasi kehadiran, kami akan mengirimkan tiket barcode akses masuk secara otomatis.\n\nKehadiran Bapak/Ibu sangat berarti bagi kami. Atas perhatian dan perkenannya, kami ucapkan terima kasih.\n\nHormat kami,\nPanitia Acara`;

    old_attending = """if (guest.rsvpStatus === 'attending') {
                                            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${guest.barcodeUid}`;
                                            const message = `Yth. Bapak/Ibu ${guest.guestName},\\n\\nTerima kasih atas konfirmasi kehadiran Bapak/Ibu pada acara *${selectedEvent.eventName}*.\\n\\nUntuk kemudahan proses registrasi dan akses masuk di lokasi, mohon berkenan menunjukkan QR Code pada tautan di bawah ini atau menyebutkan Kode Kehadiran kepada petugas kami:\\n\\n🔗 Tautan QR Code: ${qrUrl}\\n📝 Kode UID: *${guest.barcodeUid}*\\n\\nKami menantikan kehadiran Bapak/Ibu.\\n\\nHormat kami,\\nPanitia Acara`;
                                            window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
                                          } else {"""

    new_attending = """if (guest.rsvpStatus === 'attending') {
                                            const rsvpUrl = `${window.location.origin}/rsvp/${guest.barcodeUid}`;
                                            const eventDateStr = new Date(selectedEvent.eventDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                                            const eventTimeStr = new Date(selectedEvent.eventDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                                            const message = `*Surat Undangan & Tiket Masuk Resmi* 🎟️\\n\\nKepada Yth.\\n*Bapak/Ibu ${guest.guestName}*\\n\\nDengan hormat,\\n\\nKami mengucapkan terima kasih yang sebesar-besarnya atas konfirmasi kehadiran Bapak/Ibu pada acara *${selectedEvent.eventName}*.\\n\\nSebagai persyaratan akses masuk ke lokasi acara, kami telah menerbitkan *Kartu Identitas Tamu (ID Card)* resmi yang dilengkapi dengan QR Code. Mohon berkenan untuk mengunduh dan menunjukkan ID Card tersebut kepada petugas penerima tamu kami di lokasi.\\n\\n🎫 *Akses ID Card & Tiket Masuk Bapak/Ibu pada tautan berikut:*\\n🔗 ${rsvpUrl}\\n\\n*Detail Acara:*\\n📅 Hari/Tanggal: ${eventDateStr}\\n⏰ Waktu: ${eventTimeStr}\\n📍 Lokasi: ${selectedEvent.location || 'Akan diinformasikan'}\\n\\nKehadiran Bapak/Ibu merupakan suatu kehormatan bagi kami. Kami menantikan kehadiran Bapak/Ibu di acara tersebut.\\n\\nHormat kami,\\n\\n*Panitia Penyelenggara*\\n${selectedEvent.eventName}`;
                                            window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
                                          } else {"""
                                          
    content = content.replace(old_attending, new_attending)

    old_pending = """const rsvpUrl = `${window.location.origin}/rsvp/${guest.barcodeUid}`;
                                            const message = `Yth. Bapak/Ibu ${guest.guestName},\\n\\nKami dengan hormat mengundang Bapak/Ibu untuk hadir pada acara *${selectedEvent.eventName}* yang akan diselenggarakan pada:\\n\\nWaktu: ${new Date(selectedEvent.eventDate).toLocaleString()}\\nLokasi: ${selectedEvent.location || 'Akan diinformasikan'}\\n\\nMohon berkenan untuk memberikan konfirmasi kehadiran Bapak/Ibu melalui tautan berikut:\\n🔗 ${rsvpUrl}\\n\\nSetelah Bapak/Ibu melakukan konfirmasi kehadiran, kami akan mengirimkan tiket barcode akses masuk secara otomatis.\\n\\nKehadiran Bapak/Ibu sangat berarti bagi kami. Atas perhatian dan perkenannya, kami ucapkan terima kasih.\\n\\nHormat kami,\\nPanitia Acara`;
                                            window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');"""

    new_pending = """const rsvpUrl = `${window.location.origin}/rsvp/${guest.barcodeUid}`;
                                            const eventDateStr = new Date(selectedEvent.eventDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                                            const eventTimeStr = new Date(selectedEvent.eventDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                                            const message = `*Undangan Resmi Acara* ✉️\\n\\nKepada Yth.\\n*Bapak/Ibu ${guest.guestName}*\\n\\nDengan hormat,\\n\\nMelalui pesan ini, kami bermaksud mengundang Bapak/Ibu untuk berkenan hadir pada acara *${selectedEvent.eventName}* yang akan diselenggarakan pada:\\n\\n📅 *Hari/Tanggal:* ${eventDateStr}\\n⏰ *Waktu:* ${eventTimeStr}\\n📍 *Lokasi:* ${selectedEvent.location || 'Akan diinformasikan'}\\n\\nMengingat pentingnya acara ini, kami sangat mengharapkan kehadiran Bapak/Ibu. Untuk kelancaran persiapan acara, mohon berkenan memberikan konfirmasi kehadiran (RSVP) melalui sistem registrasi kami pada tautan di bawah ini:\\n\\n🔗 *Tautan Konfirmasi Kehadiran (RSVP):*\\n${rsvpUrl}\\n\\n*Catatan:*\\nDi dalam tautan tersebut juga terlampir *Surat Undangan Resmi* acara ini. Setelah Bapak/Ibu melakukan konfirmasi kehadiran melalui tautan di atas, sistem akan secara otomatis menerbitkan Kartu Identitas Tamu (ID Card) beserta QR Code sebagai tiket akses masuk resmi Bapak/Ibu.\\n\\nDemikian undangan ini kami sampaikan. Atas perhatian dan perkenan Bapak/Ibu, kami mengucapkan terima kasih yang sebesar-besarnya.\\n\\nHormat kami,\\n\\n*Panitia Penyelenggara*\\n${selectedEvent.eventName}`;
                                            window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');"""
                                            
    content = content.replace(old_pending, new_pending)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
