import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_bulk = """  const handleBulkSendInvitations = () => {
    if (!selectedEvent) return;
    
    guests
      .filter(g => selectedGuestIds.includes(g.id) && g.phone)
      .forEach(guest => {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${guest.barcodeUid}`;
        const message = `Yth. Bapak/Ibu ${guest.guestName},\\n\\nKami dengan hormat mengundang Bapak/Ibu untuk hadir pada acara *${selectedEvent.eventName}* yang akan diselenggarakan pada:\\n\\nWaktu: ${new Date(selectedEvent.eventDate).toLocaleString()}\\nLokasi: ${selectedEvent.location || 'Akan diinformasikan'}\\n\\nUntuk kemudahan proses registrasi dan akses masuk, mohon berkenan menunjukkan QR Code pada tautan di bawah ini atau menyebutkan Kode Kehadiran kepada petugas kami di lokasi:\\n\\n🔗 Tautan QR Code: ${qrUrl}\\n📝 Kode UID: *${guest.barcodeUid}*\\n\\nKehadiran Bapak/Ibu sangat berarti bagi kami. Atas perhatian dan perkenannya, kami ucapkan terima kasih.\\n\\nHormat kami,\\nPanitia Acara`;
        const phoneStr = guest.phone!.replace(/[^0-9]/g, '');
        const formattedPhone = phoneStr.startsWith('0') ? '62' + phoneStr.slice(1) : phoneStr;
        window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
      });
      
    setSelectedGuestIds([]);
  };"""

    new_bulk = """  const handleBulkSendInvitations = () => {
    if (!selectedEvent) return;
    
    guests
      .filter(g => selectedGuestIds.includes(g.id) && g.phone)
      .forEach(guest => {
        const phoneStr = guest.phone!.replace(/[^0-9]/g, '');
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
      });
      
    setSelectedGuestIds([]);
  };"""
  
    content = content.replace(old_bulk, new_bulk)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
