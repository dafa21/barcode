import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    gallery_input_create = """
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Event Highlights / Galeri Foto (Opsional)</label>
                      {newEventGallery.length > 0 && (
                        <div className="mb-2 flex gap-2 flex-wrap">
                          {newEventGallery.map((img, idx) => (
                            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                              <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  const newG = [...newEventGallery];
                                  newG.splice(idx, 1);
                                  setNewEventGallery(newG);
                                }}
                                className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm"
                              >
                                <X className="w-2 h-2" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={e => {
                          const files = Array.from(e.target.files || []);
                          if (files.length > 0) {
                            Promise.all(files.map(file => {
                              return new Promise((resolve) => {
                                if (file.size > 5 * 1024 * 1024) {
                                  alert("File size must be less than 5MB");
                                  resolve(null);
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  resolve(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              });
                            })).then(results => {
                              const valid = results.filter(Boolean) as string[];
                              setNewEventGallery(prev => [...prev, ...valid]);
                            });
                          }
                        }}
                        className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                      />
                    </div>
"""

    gallery_input_edit = gallery_input_create.replace("                    ", "                            ")

    content = content.replace("                            <div>\n                              <label className=\"block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold\">Isi Undangan Digital", gallery_input_edit + "                            <div>\n                              <label className=\"block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold\">Isi Undangan Digital")
    content = content.replace("                    <div>\n                      <label className=\"block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold\">Isi Undangan Digital", gallery_input_create + "                    <div>\n                      <label className=\"block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold\">Isi Undangan Digital")

    # In DigitalInvitation preview
    content = content.replace("backsound={newEventBacksound}", "backsound={newEventBacksound}\n                                      gallery={JSON.stringify(newEventGallery)}")

    with open(filepath, "w") as f:
        f.write(content)

patch("src/components/OfficeAdminDashboard.tsx")
