import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # 1. State for invitation
    old_state = """  const [newEventLogo, setNewEventLogo] = useState<string | null>(null);
  
  const [editingEventId, setEditingEventId] = useState<string | null>(null);"""
    
    new_state = """  const [newEventLogo, setNewEventLogo] = useState<string | null>(null);
  const [newEventInvitationFile, setNewEventInvitationFile] = useState<string | null>(null);
  
  const [editingEventId, setEditingEventId] = useState<string | null>(null);"""
    content = content.replace(old_state, new_state)

    # 2. Add event
    old_add_body = """        body: JSON.stringify({ 
          eventName: newEventName, 
          eventDate: newEventDate, 
          location: newEventLocation,
          logo: newEventLogo
        })"""
    new_add_body = """        body: JSON.stringify({ 
          eventName: newEventName, 
          eventDate: newEventDate, 
          location: newEventLocation,
          logo: newEventLogo,
          invitationFile: newEventInvitationFile
        })"""
    content = content.replace(old_add_body, new_add_body)

    # 3. Handle Add success reset
    old_reset = """        setNewEventLocation("");
        setNewEventLogo(null);
        setIsAddEventModalOpen(false);"""
    new_reset = """        setNewEventLocation("");
        setNewEventLogo(null);
        setNewEventInvitationFile(null);
        setIsAddEventModalOpen(false);"""
    content = content.replace(old_reset, new_reset)

    # 4. Open edit modal
    old_edit_open = """                          setNewEventLogo(event.logo || null);
                          setEditingEventId(event.id);
                          setIsEditEventModalOpen(true);"""
    new_edit_open = """                          setNewEventLogo(event.logo || null);
                          setNewEventInvitationFile(event.invitationFile || null);
                          setEditingEventId(event.id);
                          setIsEditEventModalOpen(true);"""
    content = content.replace(old_edit_open, new_edit_open)

    # 5. Update event body
    old_update_body = """        body: JSON.stringify({ 
           eventName: newEventName, 
           eventDate: newEventDate, 
           location: newEventLocation,
          logo: newEventLogo
        })"""
    new_update_body = """        body: JSON.stringify({ 
           eventName: newEventName, 
           eventDate: newEventDate, 
           location: newEventLocation,
          logo: newEventLogo,
          invitationFile: newEventInvitationFile
        })"""
    content = content.replace(old_update_body, new_update_body)

    # 6. Update event reset
    old_update_reset = """        setNewEventLocation("");
        setNewEventLogo(null);
        fetchEvents();"""
    new_update_reset = """        setNewEventLocation("");
        setNewEventLogo(null);
        setNewEventInvitationFile(null);
        fetchEvents();"""
    content = content.replace(old_update_reset, new_update_reset)

    # 7. Add file input to forms
    # We find both "EVENT LOGO (OPTIONAL)" and append
    form_add = """                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Event Logo (Optional)</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setNewEventLogo(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload" className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-indigo-100 transition-colors">
                        Pilih File
                      </label>
                      <span className="text-sm text-gray-500">{newEventLogo ? 'Logo terpilih' : 'Tidak ada file yang dipilih'}</span>
                    </div>
                  </div>"""

    new_form_add = form_add + """
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">File Undangan (PDF)</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="file" 
                        accept="application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setNewEventInvitationFile(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="invitation-upload"
                      />
                      <label htmlFor="invitation-upload" className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-indigo-100 transition-colors">
                        Pilih File PDF
                      </label>
                      <span className="text-sm text-gray-500">{newEventInvitationFile ? 'File PDF terpilih' : 'Tidak ada file yang dipilih'}</span>
                    </div>
                  </div>"""
    
    content = content.replace(form_add, new_form_add)
    
    # 8. Add file input to edit form
    form_edit = """                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Event Logo (Optional)</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setNewEventLogo(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="logo-upload-edit"
                      />
                      <label htmlFor="logo-upload-edit" className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-indigo-100 transition-colors">
                        Pilih File
                      </label>
                      <span className="text-sm text-gray-500">{newEventLogo ? 'Logo terpilih' : 'Tidak ada file yang dipilih'}</span>
                    </div>
                  </div>"""

    new_form_edit = form_edit + """
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">File Undangan (PDF)</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="file" 
                        accept="application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setNewEventInvitationFile(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="invitation-upload-edit"
                      />
                      <label htmlFor="invitation-upload-edit" className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium cursor-pointer hover:bg-indigo-100 transition-colors">
                        Pilih File PDF
                      </label>
                      <span className="text-sm text-gray-500">{newEventInvitationFile ? 'File PDF terpilih' : 'Tidak ada file yang dipilih'}</span>
                    </div>
                  </div>"""

    content = content.replace(form_edit, new_form_edit)

    # 9. Modify WhatsApp message URL
    # Replace the existing RSVP message text with one containing the file link.
    
    # Let's find:
    # const message = `*Undangan Resmi Acara* ✉️\\n\\nKepada Yth.\\n*Bapak/Ibu ${guest.guestName}*\\n\\nDengan hormat,\\n\\nMelalui pesan ini, kami bermaksud mengundang Bapak/Ibu untuk berkenan hadir pada acara *${selectedEvent.eventName}* yang akan diselenggarakan pada:\\n\\n📅 *Hari/Tanggal:* ${eventDateStr}\\n⏰ *Waktu:* ${eventTimeStr}\\n📍 *Lokasi:* ${selectedEvent.location || 'Akan diinformasikan'}\\n\\nMengingat pentingnya acara ini, kami sangat mengharapkan kehadiran Bapak/Ibu. Untuk kelancaran persiapan acara, mohon berkenan memberikan konfirmasi kehadiran (RSVP) melalui sistem registrasi kami pada tautan di bawah ini:\\n\\n🔗 *Tautan Konfirmasi Kehadiran (RSVP):*\\n${rsvpUrl}\\n\\n*Catatan:*\\nDi dalam tautan tersebut juga terlampir *Surat Undangan Resmi* acara ini. Setelah Bapak/Ibu melakukan konfirmasi kehadiran melalui tautan di atas, sistem akan secara otomatis menerbitkan Kartu Identitas Tamu (ID Card) beserta QR Code sebagai tiket akses masuk resmi Bapak/Ibu.\\n\\nDemikian undangan ini kami sampaikan. Atas perhatian dan perkenan Bapak/Ibu, kami mengucapkan terima kasih yang sebesar-besarnya.\\n\\nHormat kami,\\n\\n*Panitia Penyelenggara*\\n${selectedEvent.eventName}`;

    wa_msg_old = """const message = `*Undangan Resmi Acara* ✉️\\n\\nKepada Yth.\\n*Bapak/Ibu ${guest.guestName}*\\n\\nDengan hormat,\\n\\nMelalui pesan ini, kami bermaksud mengundang Bapak/Ibu untuk berkenan hadir pada acara *${selectedEvent.eventName}* yang akan diselenggarakan pada:\\n\\n📅 *Hari/Tanggal:* ${eventDateStr}\\n⏰ *Waktu:* ${eventTimeStr}\\n📍 *Lokasi:* ${selectedEvent.location || 'Akan diinformasikan'}\\n\\nMengingat pentingnya acara ini, kami sangat mengharapkan kehadiran Bapak/Ibu. Untuk kelancaran persiapan acara, mohon berkenan memberikan konfirmasi kehadiran (RSVP) melalui sistem registrasi kami pada tautan di bawah ini:\\n\\n🔗 *Tautan Konfirmasi Kehadiran (RSVP):*\\n${rsvpUrl}\\n\\n*Catatan:*\\nDi dalam tautan tersebut juga terlampir *Surat Undangan Resmi* acara ini. Setelah Bapak/Ibu melakukan konfirmasi kehadiran melalui tautan di atas, sistem akan secara otomatis menerbitkan Kartu Identitas Tamu (ID Card) beserta QR Code sebagai tiket akses masuk resmi Bapak/Ibu.\\n\\nDemikian undangan ini kami sampaikan. Atas perhatian dan perkenan Bapak/Ibu, kami mengucapkan terima kasih yang sebesar-besarnya.\\n\\nHormat kami,\\n\\n*Panitia Penyelenggara*\\n${selectedEvent.eventName}`;"""
    
    wa_msg_new = """const eventSlug = encodeURIComponent(selectedEvent.eventName.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                                            const fileUrl = `${window.location.origin}/undangan/${eventSlug}`;
                                            const message = `*Undangan Resmi Acara* ✉️\\n\\nKepada Yth.\\n*Bapak/Ibu ${guest.guestName}*\\n\\nDengan hormat,\\n\\nMelalui pesan ini, kami bermaksud mengundang Bapak/Ibu untuk berkenan hadir pada acara *${selectedEvent.eventName}* yang akan diselenggarakan pada:\\n\\n📅 *Hari/Tanggal:* ${eventDateStr}\\n⏰ *Waktu:* ${eventTimeStr}\\n📍 *Lokasi:* ${selectedEvent.location || 'Akan diinformasikan'}\\n\\n📎 *Tautan File Undangan Resmi:*\\n${fileUrl}\\n\\nMengingat pentingnya acara ini, kami sangat mengharapkan kehadiran Bapak/Ibu. Untuk kelancaran persiapan acara, mohon berkenan memberikan konfirmasi kehadiran (RSVP) melalui sistem registrasi kami pada tautan di bawah ini:\\n\\n🔗 *Tautan Konfirmasi Kehadiran (RSVP):*\\n${rsvpUrl}\\n\\nSetelah Bapak/Ibu melakukan konfirmasi kehadiran melalui tautan di atas, sistem akan secara otomatis menerbitkan Kartu Identitas Tamu (ID Card) beserta QR Code sebagai tiket akses masuk resmi Bapak/Ibu.\\n\\nDemikian undangan ini kami sampaikan. Atas perhatian dan perkenan Bapak/Ibu, kami mengucapkan terima kasih yang sebesar-besarnya.\\n\\nHormat kami,\\n\\n*Panitia Penyelenggara*\\n${selectedEvent.eventName}`;"""
    
    content = content.replace(wa_msg_old, wa_msg_new)


    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
