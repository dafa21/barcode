import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # 1. Update imports
    old_import = "import { CheckCircle2, XCircle, MapPin, Calendar as CalendarIcon, Users } from 'lucide-react';"
    new_import = "import { CheckCircle2, XCircle, MapPin, Calendar as CalendarIcon, Users, FileText, X } from 'lucide-react';"
    content = content.replace(old_import, new_import)

    # 2. Add state
    old_states = """  const [generatedTwibbon, setGeneratedTwibbon] = useState<string | null>(null);
  const [isGeneratingTwibbon, setIsGeneratingTwibbon] = useState(false);"""
    new_states = """  const [generatedTwibbon, setGeneratedTwibbon] = useState<string | null>(null);
  const [isGeneratingTwibbon, setIsGeneratingTwibbon] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);"""
    content = content.replace(old_states, new_states)

    # 3. Add letter button to UI
    old_button_area = """          <h2 className="text-xl font-bold text-gray-900 mb-1">{data.guestName}</h2>
          {data.company && <p className="text-sm text-gray-500 mb-8">{data.company}</p>}"""

    new_button_area = """          <h2 className="text-xl font-bold text-gray-900 mb-1">{data.guestName}</h2>
          {data.company && <p className="text-sm text-gray-500">{data.company}</p>}
          
          <div className="flex justify-center mb-8 mt-4">
            <button 
              onClick={() => setIsLetterOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              Lihat Surat Undangan Resmi
            </button>
          </div>"""
    content = content.replace(old_button_area, new_button_area)

    # 4. Add modal at the end before final div
    old_end = """        </div>
      </div>
    </div>
  );
}"""

    new_end = """        </div>
      </div>

      {isLetterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsLetterOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50">
              <h3 className="font-bold text-gray-900 tracking-wide">Lampiran Surat Undangan</h3>
              <button onClick={() => setIsLetterOpen(false)} className="text-gray-400 hover:text-gray-700 p-1">
                <X className="w-5 h-5"/>
              </button>
            </div>
            <div className="p-6 md:p-10 overflow-y-auto font-serif text-gray-800 text-sm md:text-base bg-[#fcfcfc] relative">
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
              <div className="relative z-10">
                <div className="text-center mb-10 border-b-2 border-gray-800 pb-6">
                  <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-900">{data.event.eventName}</h2>
                  <p className="text-gray-600 mt-2 font-sans text-sm tracking-widest uppercase">Sekretariat Panitia Penyelenggara</p>
                </div>
                
                <div className="flex justify-between mb-10 text-gray-700">
                  <div className="space-y-1">
                    <p>Nomor: 001/PAN-{data.event.id.substring(0,4).toUpperCase()}/2026</p>
                    <p>Lampiran: 1 (Satu) Berkas</p>
                    <p>Hal: <strong>Undangan Kehadiran</strong></p>
                  </div>
                  <div className="text-right">
                    <p>{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>

                <div className="mb-8 text-gray-800">
                  <p>Kepada Yth.</p>
                  <p className="font-bold text-lg mt-1">Bapak/Ibu {data.guestName}</p>
                  {data.company && <p className="mt-1 font-medium">{data.company}</p>}
                  <p className="mt-1">di Tempat</p>
                </div>

                <div className="space-y-5 text-justify leading-relaxed text-gray-700">
                  <p>Dengan hormat,</p>
                  <p>Puji syukur kita panjatkan kehadirat Tuhan Yang Maha Esa atas segala rahmat dan karunia-Nya. Sehubungan dengan akan diselenggarakannya acara <strong>{data.event.eventName}</strong>, kami selaku panitia penyelenggara bermaksud mengundang Bapak/Ibu untuk berkenan hadir pada acara tersebut.</p>
                  
                  <p>Adapun kegiatan ini insyaAllah akan dilaksanakan pada:</p>
                  <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 my-6 font-sans">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="w-32 py-2 font-semibold text-gray-600">Hari/Tanggal</td>
                          <td className="w-4 py-2">:</td>
                          <td className="py-2 font-medium">{new Date(data.event.eventDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        </tr>
                        <tr>
                          <td className="w-32 py-2 font-semibold text-gray-600">Waktu</td>
                          <td className="w-4 py-2">:</td>
                          <td className="py-2 font-medium">{new Date(data.event.eventDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - Selesai</td>
                        </tr>
                        <tr>
                          <td className="w-32 py-2 font-semibold text-gray-600 align-top">Tempat</td>
                          <td className="w-4 py-2 align-top">:</td>
                          <td className="py-2 font-medium leading-relaxed">{data.event.location || 'Akan diinformasikan lebih lanjut'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p>Mengingat pentingnya acara ini, kami sangat mengharapkan kehadiran Bapak/Ibu tepat pada waktunya. Kehadiran dan partisipasi aktif dari Bapak/Ibu akan sangat berarti bagi kesuksesan acara ini.</p>
                  
                  <p>Demikian surat undangan ini kami sampaikan. Atas perhatian, dukungan, serta kehadiran Bapak/Ibu, kami mengucapkan terima kasih yang sebesar-besarnya.</p>
                </div>

                <div className="mt-16 text-right">
                  <p className="text-gray-700">Hormat Kami,</p>
                  <p className="font-bold mt-1 text-gray-900">Panitia Penyelenggara</p>
                  <div className="h-24 mt-2 flex justify-end items-end">
                    <div className="w-48 border-b border-gray-400"></div>
                  </div>
                  <p className="font-bold text-gray-900">{data.event.eventName}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0 gap-3">
              <button onClick={() => window.print()} className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors shadow-md">
                Cetak Surat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}"""

    content = content.replace(old_end, new_end)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/GuestRSVP.tsx")
