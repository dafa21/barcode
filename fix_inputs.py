import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Replace "Kop Surat" with "Background Undangan Digital"
    content = content.replace("Kop Surat / Background (Gambar)", "Background Undangan Digital")
    content = content.replace("Kop Surat", "Background")
    
    # Hide "Ukuran Surat"
    content = content.replace(
        '<label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Ukuran Surat</label>',
        '<label className="hidden text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Ukuran Surat</label>'
    )
    content = content.replace(
        'value={newEventLetterSize}\n                              onChange={e => setNewEventLetterSize(e.target.value as any)}\n                              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3"',
        'value={newEventLetterSize}\n                              onChange={e => setNewEventLetterSize(e.target.value as any)}\n                              className="hidden w-full text-xs bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3"'
    )
    content = content.replace(
        'value={newEventLetterSize}\n                        onChange={e => setNewEventLetterSize(e.target.value as any)}\n                        className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3"',
        'value={newEventLetterSize}\n                        onChange={e => setNewEventLetterSize(e.target.value as any)}\n                        className="hidden w-full text-xs bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3"'
    )

    # Insert Hero Image and Backsound inputs after Background
    hero_and_backsound = """
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Hero Image / Foto Utama (Opsional)</label>
                      {newEventHeroImage && (
                        <div className="mb-2 relative w-full h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                          <img src={newEventHeroImage} alt="Hero" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setNewEventHeroImage(null)}
                            className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              alert("File size must be less than 5MB");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewEventHeroImage(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Backsound Musik (MP3/WAV Opsional)</label>
                      {newEventBacksound && (
                        <div className="mb-2 relative w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50 p-2 flex items-center">
                          <audio src={newEventBacksound} controls className="w-full h-8" />
                          <button
                            type="button"
                            onClick={() => setNewEventBacksound(null)}
                            className="ml-2 w-6 h-6 bg-white rounded-full flex shrink-0 items-center justify-center text-red-500 shadow-sm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 10 * 1024 * 1024) {
                              alert("File size must be less than 10MB");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewEventBacksound(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                      />
                    </div>
"""

    content = content.replace("<div>\n                      <label className=\"block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold\">Isi Surat", hero_and_backsound + "\n                    <div>\n                      <label className=\"block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold\">Isi Undangan Digital")
    content = content.replace("<div>\n                            <label className=\"block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold\">Isi Surat", hero_and_backsound.replace("                    ", "                            ") + "\n                            <div>\n                              <label className=\"block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold\">Isi Undangan Digital")

    # Change "Isi Surat" to "Isi Undangan Digital" inside label text
    content = content.replace("Isi Surat (Gunakan {{nama_tamu}} untuk nama tamu)", "Isi Undangan (Gunakan {{nama_tamu}} untuk nama tamu)")
    
    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
