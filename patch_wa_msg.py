import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Change single RSVP message ticket link
    old_code = """                                            const rsvpUrl = `${getBaseUrl()}/rsvp/${guest.barcodeUid}`;
                                            const eventDateStr = new Date(selectedEvent.eventDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                                            const eventTimeStr = new Date(selectedEvent.eventDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                                            const message = `*Surat Undangan & Tiket Masuk Resmi* 🎟️\\n\\nKepada Yth.\\n*Bapak/Ibu ${guest.guestName}*\\n\\nDengan hormat,\\n\\nKami mengucapkan terima kasih yang sebesar-besarnya atas konfirmasi kehadiran Bapak/Ibu pada acara *${selectedEvent.eventName}*.\\n\\nSebagai persyaratan akses masuk ke lokasi acara, kami telah menerbitkan *Kartu Identitas Tamu (ID Card)* resmi yang dilengkapi dengan QR Code. Mohon berkenan untuk mengunduh dan menunjukkan ID Card tersebut kepada petugas penerima tamu kami di lokasi.\\n\\n🎫 *Akses ID Card & Tiket Masuk Bapak/Ibu pada tautan berikut:*\\n🔗 ${rsvpUrl}\\n\\n*Detail Acara:*\\n📅 Hari/Tanggal: ${eventDateStr}\\n⏰ Waktu: ${eventTimeStr}\\n📍 Lokasi: ${selectedEvent.location || 'Akan diinformasikan'}\\n\\nKehadiran Bapak/Ibu merupakan suatu kehormatan bagi kami. Kami menantikan kehadiran Bapak/Ibu di acara tersebut.\\n\\nHormat kami,\\n\\n*Panitia Penyelenggara*\\n${selectedEvent.eventName}`;"""

    new_code = """                                            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${guest.barcodeUid}`;
                                            const eventDateStr = new Date(selectedEvent.eventDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                                            const eventTimeStr = new Date(selectedEvent.eventDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                                            const message = `*Surat Undangan & Tiket Masuk Resmi* 🎟️\\n\\nKepada Yth.\\n*Bapak/Ibu ${guest.guestName}*\\n\\nDengan hormat,\\n\\nKami mengucapkan terima kasih yang sebesar-besarnya atas konfirmasi kehadiran Bapak/Ibu pada acara *${selectedEvent.eventName}*.\\n\\nSebagai persyaratan akses masuk ke lokasi acara, kami telah menerbitkan Kode QR resmi. Mohon berkenan untuk menunjukkan Kode QR tersebut kepada petugas penerima tamu kami di lokasi.\\n\\n🎫 *Tautan Tiket Kode QR Bapak/Ibu:*\\n🔗 ${qrUrl}\\n📝 Kode UID: *${guest.barcodeUid}*\\n\\n*Detail Acara:*\\n📅 Hari/Tanggal: ${eventDateStr}\\n⏰ Waktu: ${eventTimeStr}\\n📍 Lokasi: ${selectedEvent.location || 'Akan diinformasikan'}\\n\\nKehadiran Bapak/Ibu merupakan suatu kehormatan bagi kami. Kami menantikan kehadiran Bapak/Ibu di acara tersebut.\\n\\nHormat kami,\\n\\n*Panitia Penyelenggara*\\n${selectedEvent.eventName}`;"""
    
    content = content.replace(old_code, new_code)

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/OfficeAdminDashboard.tsx")
