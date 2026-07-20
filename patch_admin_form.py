import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    add_logo_div_end = """                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const img = new Image();
                              const url = URL.createObjectURL(file);
                              img.onload = () => {
                                URL.revokeObjectURL(url);
                                const canvas = document.createElement('canvas');
                                let width = img.width;
                                let height = img.height;
                                const max = 300;
                                if (width > max || height > max) {
                                  const ratio = Math.min(max / width, max / height);
                                  width = width * ratio;
                                  height = height * ratio;
                                }
                                canvas.width = width;
                                canvas.height = height;
                                const ctx = canvas.getContext('2d');
                                if(ctx) {
                                   ctx.drawImage(img, 0, 0, width, height);
                                   setNewEventLogo(canvas.toDataURL('image/jpeg', 0.85));
                                }
                              };
                              img.src = url;
                            } else {
                              setNewEventLogo(undefined);
                            }
                          }}
                          className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                        />
                      </div>"""

    new_add_logo_div_end = add_logo_div_end + """
                      <div className="mt-4">
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">File Undangan (PDF)</label>
                        {newEventInvitationFile && (
                          <div className="mb-2 p-2 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-between">
                            <span className="text-xs text-gray-600 truncate">File PDF terpilih</span>
                            <button
                              type="button"
                              onClick={() => setNewEventInvitationFile(null)}
                              className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setNewEventInvitationFile(reader.result as string);
                              reader.readAsDataURL(file);
                            } else {
                              setNewEventInvitationFile(null);
                            }
                          }}
                          className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                        />
                      </div>"""

    content = content.replace(add_logo_div_end, new_add_logo_div_end)

    edit_logo_div_end = """                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const img = new Image();
                        const url = URL.createObjectURL(file);
                        img.onload = () => {
                          URL.revokeObjectURL(url);
                          const canvas = document.createElement('canvas');
                          let width = img.width;
                          let height = img.height;
                          const max = 300;
                          if (width > max || height > max) {
                            const ratio = Math.min(max / width, max / height);
                            width = width * ratio;
                            height = height * ratio;
                          }
                          canvas.width = width;
                          canvas.height = height;
                          const ctx = canvas.getContext('2d');
                          if(ctx) {
                             ctx.drawImage(img, 0, 0, width, height);
                             setNewEventLogo(canvas.toDataURL('image/jpeg', 0.85));
                          }
                        };
                        img.src = url;
                      } else {
                        setNewEventLogo(undefined);
                      }
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>"""

    new_edit_logo_div_end = edit_logo_div_end + """
                <div className="mt-4">
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">File Undangan (PDF)</label>
                  {newEventInvitationFile && (
                    <div className="mb-2 p-2 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-between">
                      <span className="text-xs text-gray-600 truncate">File PDF terpilih</span>
                      <button
                        type="button"
                        onClick={() => setNewEventInvitationFile(null)}
                        className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setNewEventInvitationFile(reader.result as string);
                        reader.readAsDataURL(file);
                      } else {
                        setNewEventInvitationFile(null);
                      }
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>"""

    content = content.replace(edit_logo_div_end, new_edit_logo_div_end)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
