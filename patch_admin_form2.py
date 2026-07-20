import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # The Create Event Modal
    add_letter_fields = """
                      <div className="mt-4 border-t border-gray-100 pt-4">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Pengaturan Surat</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Ukuran Kertas</label>
                            <select
                              value={newEventLetterSize}
                              onChange={e => setNewEventLetterSize(e.target.value as any)}
                              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3"
                            >
                              <option value="A4">A4</option>
                              <option value="LETTER">Letter</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Kop Surat / Background (Gambar)</label>
                            {newEventLetterBackground && (
                              <div className="mb-2 relative w-full h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                <img src={newEventLetterBackground} alt="Background Surat" className="w-full h-full object-contain" />
                                <button
                                  type="button"
                                  onClick={() => setNewEventLetterBackground(null)}
                                  className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => setNewEventLetterBackground(reader.result as string);
                                  reader.readAsDataURL(file);
                                } else {
                                  setNewEventLetterBackground(null);
                                }
                              }}
                              className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Isi Surat (Gunakan {'{{nama_tamu}}'} untuk nama tamu)</label>
                            <textarea
                              value={newEventLetterContent}
                              onChange={e => setNewEventLetterContent(e.target.value)}
                              rows={5}
                              placeholder="Ketik isi surat disini..."
                              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3"
                            />
                          </div>
                        </div>
                      </div>
"""
    
    # Let's insert these right before the create button (or replace a placeholder)
    add_btn = """                      <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-[10px] font-bold uppercase tracking-widest shadow-sm">
                        Create
                      </button>"""
    new_add_btn = add_letter_fields + add_btn

    content = content.replace(add_btn, new_add_btn)


    # The Edit Event Modal
    edit_letter_fields = """
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Pengaturan Surat</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Ukuran Kertas</label>
                      <select
                        value={newEventLetterSize}
                        onChange={e => setNewEventLetterSize(e.target.value as any)}
                        className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3"
                      >
                        <option value="A4">A4</option>
                        <option value="LETTER">Letter</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Kop Surat / Background (Gambar)</label>
                      {newEventLetterBackground && (
                        <div className="mb-2 relative w-full h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                          <img src={newEventLetterBackground} alt="Background Surat" className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => setNewEventLetterBackground(null)}
                            className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setNewEventLetterBackground(reader.result as string);
                            reader.readAsDataURL(file);
                          } else {
                            setNewEventLetterBackground(null);
                          }
                        }}
                        className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Isi Surat (Gunakan {'{{nama_tamu}}'} untuk nama tamu)</label>
                      <textarea
                        value={newEventLetterContent}
                        onChange={e => setNewEventLetterContent(e.target.value)}
                        rows={5}
                        placeholder="Ketik isi surat disini..."
                        className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3"
                      />
                    </div>
                  </div>
                </div>
"""
    edit_btn = """                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-[10px] font-bold uppercase tracking-widest mt-4 shadow-md border border-indigo-500/50">
                  Save Changes
                </button>"""
    new_edit_btn = edit_letter_fields + edit_btn
    content = content.replace(edit_btn, new_edit_btn)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
