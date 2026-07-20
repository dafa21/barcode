import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    modal_code = """
      {/* Letter Print Modal */}
      {printingGuest && selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <h2 className="text-xl font-serif text-gray-900">Lampiran Surat Undangan</h2>
              <button 
                onClick={() => setPrintingGuest(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 bg-gray-50 flex justify-center items-start min-h-[500px]">
              <div 
                id="letter-print-area" 
                className="bg-white shadow-lg relative overflow-hidden"
                style={{ 
                  width: selectedEvent.letterSize === 'LETTER' ? '816px' : '794px',
                  minHeight: selectedEvent.letterSize === 'LETTER' ? '1056px' : '1123px',
                  padding: '96px 72px'
                }}
              >
                {selectedEvent.letterBackground && (
                  <img 
                    src={selectedEvent.letterBackground} 
                    alt="Background" 
                    className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" 
                  />
                )}
                
                <div className="relative z-10 font-serif text-gray-800 leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: (selectedEvent.letterContent || '').replace(/\{\{nama_tamu\}\}/g, printingGuest.guestName) }} />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6">
              <button
                onClick={async () => {
                  try {
                    const html2canvas = (await import('html2canvas')).default;
                    const jsPDF = (await import('jspdf')).default;
                    const element = document.getElementById('letter-print-area');
                    if (!element) return;
                    
                    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
                    const imgData = canvas.toDataURL('image/png');
                    const isLetter = selectedEvent.letterSize === 'LETTER';
                    const pdf = new jsPDF({
                      orientation: 'portrait',
                      unit: 'mm',
                      format: isLetter ? 'letter' : 'a4'
                    });
                    
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`Surat_Undangan_${printingGuest.guestName.replace(/\\s+/g, '_')}.pdf`);
                  } catch (err) {
                    console.error(err);
                    alert('Gagal mencetak surat.');
                  }
                }}
                className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors text-sm font-bold uppercase tracking-widest shadow-md"
              >
                Cetak Surat
              </button>
            </div>
          </div>
        </div>
      )}
"""
    
    idx = content.rfind("    </>")
    if idx != -1:
        content = content[:idx] + modal_code + content[idx:]

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
