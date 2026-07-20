import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Add imports
    import_statement = "import ReactQuill from 'react-quill';\nimport 'react-quill/dist/quill.snow.css';\n"
    content = content.replace("import * as XLSX from 'xlsx';", "import * as XLSX from 'xlsx';\n" + import_statement)

    # First occurrence
    old_textarea_1 = """                            <textarea
                              value={newEventLetterContent}
                              onChange={e => setNewEventLetterContent(e.target.value)}
                              rows={5}
                              placeholder="Ketik isi surat disini..."
                              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3"
                            />"""
    new_textarea_1 = """                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:text-xs">
                              <ReactQuill 
                                theme="snow" 
                                value={newEventLetterContent} 
                                onChange={setNewEventLetterContent} 
                                placeholder="Ketik isi surat disini..."
                                modules={{ toolbar: [['bold', 'italic', 'underline', 'strike'], [{'list': 'ordered'}, {'list': 'bullet'}], [{'align': []}]] }}
                              />
                            </div>
                            
                            {/* Live Preview Letter */}
                            {newEventLetterContent && (
                                <div className="mt-4 border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50/50">
                                  <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">Live Preview Surat</h4>
                                  <div 
                                    className="bg-white border border-gray-200 shadow-sm relative overflow-hidden mx-auto"
                                    style={{ 
                                      width: newEventLetterSize === 'LETTER' ? '100%' : '100%', 
                                      aspectRatio: newEventLetterSize === 'LETTER' ? '8.5/11' : '1/1.414',
                                      padding: '8% 6%'
                                    }}
                                  >
                                    {newEventLetterBackground && (
                                      <img 
                                        src={newEventLetterBackground} 
                                        alt="Kop Surat" 
                                        className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" 
                                      />
                                    )}
                                    <div 
                                      className="relative z-10 text-xs text-gray-800 font-serif leading-relaxed" 
                                      dangerouslySetInnerHTML={{ __html: newEventLetterContent.replace(/{{nama_tamu}}/g, '<span class="font-bold underline">Nama Tamu Preview</span>') }}
                                    />
                                  </div>
                                </div>
                            )}"""
    content = content.replace(old_textarea_1, new_textarea_1)

    # Second occurrence
    old_textarea_2 = """                      <textarea
                        value={newEventLetterContent}
                        onChange={e => setNewEventLetterContent(e.target.value)}
                        rows={5}
                        placeholder="Ketik isi surat disini..."
                        className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3"
                      />"""
    new_textarea_2 = """                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:text-xs">
                        <ReactQuill 
                          theme="snow" 
                          value={newEventLetterContent} 
                          onChange={setNewEventLetterContent} 
                          placeholder="Ketik isi surat disini..."
                          modules={{ toolbar: [['bold', 'italic', 'underline', 'strike'], [{'list': 'ordered'}, {'list': 'bullet'}], [{'align': []}]] }}
                        />
                      </div>
                      
                      {/* Live Preview Letter */}
                      {newEventLetterContent && (
                          <div className="mt-4 border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50/50">
                            <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">Live Preview Surat</h4>
                            <div 
                              className="bg-white border border-gray-200 shadow-sm relative overflow-hidden mx-auto"
                              style={{ 
                                width: newEventLetterSize === 'LETTER' ? '100%' : '100%', 
                                aspectRatio: newEventLetterSize === 'LETTER' ? '8.5/11' : '1/1.414',
                                padding: '8% 6%'
                              }}
                            >
                              {newEventLetterBackground && (
                                <img 
                                  src={newEventLetterBackground} 
                                  alt="Kop Surat" 
                                  className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" 
                                />
                              )}
                              <div 
                                className="relative z-10 text-xs text-gray-800 font-serif leading-relaxed" 
                                dangerouslySetInnerHTML={{ __html: newEventLetterContent.replace(/{{nama_tamu}}/g, '<span class="font-bold underline">Nama Tamu Preview</span>') }}
                              />
                            </div>
                          </div>
                      )}"""
    content = content.replace(old_textarea_2, new_textarea_2)
    
    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
