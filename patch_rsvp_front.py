import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_state = """  const [success, setSuccess] = useState(false);
  const [pax, setPax] = useState(1);"""
    
    new_state = """  const [success, setSuccess] = useState(false);
  const [paxInput, setPaxInput] = useState<string>('1');
  const pax = parseInt(paxInput) || 1;
  const [additionalGuests, setAdditionalGuests] = useState<{guestName: string, phone: string, jobTitle: string}[]>([]);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (pax > 1) {
      setAdditionalGuests(prev => {
        const needed = pax - 1;
        const copy = [...prev];
        while (copy.length < needed) copy.push({ guestName: '', phone: '', jobTitle: '' });
        while (copy.length > needed) copy.pop();
        return copy;
      });
    } else {
      setAdditionalGuests([]);
    }
  }, [pax]);"""
    content = content.replace(old_state, new_state)

    old_fetch_ok = """          setPax(guestData.paxCount || 1);
          if (guestData.rsvpStatus !== 'pending') {"""
    new_fetch_ok = """          setPaxInput(String(guestData.paxCount || 1));
          if (guestData.rsvpStatus !== 'pending') {"""
    content = content.replace(old_fetch_ok, new_fetch_ok)

    old_submit = """  const handleSubmit = async (status: 'attending' | 'not_attending') => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/guests/rsvp/${barcodeUid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rsvpStatus: status, paxCount: pax })
      });
      
      if (res.ok) {
        setData(prev => prev ? { ...prev, rsvpStatus: status, paxCount: pax } : null);
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };"""
    
    new_submit = """  const handleSubmit = async (status: 'attending' | 'not_attending') => {
    setFormError('');
    if (status === 'attending' && pax > 1) {
      for (let i = 0; i < additionalGuests.length; i++) {
        const ag = additionalGuests[i];
        if (!ag.guestName.trim() || !ag.phone.trim()) {
          setFormError('Mohon isi Nama dan Nomor WhatsApp untuk semua tamu tambahan.');
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/guests/rsvp/${barcodeUid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rsvpStatus: status, 
          paxCount: pax,
          additionalGuests: status === 'attending' ? additionalGuests : [] 
        })
      });
      
      if (res.ok) {
        setData(prev => prev ? { ...prev, rsvpStatus: status, paxCount: pax } : null);
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };"""
    content = content.replace(old_submit, new_submit)

    old_ui = """            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-left">
                  How many people will be attending?
                </label>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <Users className="w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={pax}
                    onChange={(e) => setPax(parseInt(e.target.value) || 1)}
                    className="w-full bg-transparent outline-none text-lg font-medium text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">"""
              
    new_ui = """            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-left">
                  How many people will be attending?
                </label>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <Users className="w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={paxInput}
                    onChange={(e) => setPaxInput(e.target.value)}
                    className="w-full bg-transparent outline-none text-lg font-medium text-gray-900"
                  />
                </div>
              </div>

              {pax > 1 && (
                <div className="space-y-4 pt-4 border-t border-gray-100 text-left">
                  <h3 className="text-sm font-semibold text-gray-800">Detail Tamu Tambahan</h3>
                  <p className="text-xs text-gray-500 mb-4">Mohon isi data tamu tambahan yang akan hadir bersama Anda. Institusi akan otomatis disamakan dengan institusi Anda.</p>
                  
                  {additionalGuests.map((ag, index) => (
                    <div key={index} className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
                      <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Tamu #{index + 2}</p>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Nama Lengkap *</label>
                        <input 
                          type="text"
                          required
                          value={ag.guestName}
                          onChange={e => {
                            const newGuests = [...additionalGuests];
                            newGuests[index].guestName = e.target.value;
                            setAdditionalGuests(newGuests);
                          }}
                          className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">No. WhatsApp *</label>
                        <input 
                          type="tel"
                          required
                          value={ag.phone}
                          onChange={e => {
                            const newGuests = [...additionalGuests];
                            newGuests[index].phone = e.target.value;
                            setAdditionalGuests(newGuests);
                          }}
                          className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Jabatan (Opsional)</label>
                        <input 
                          type="text"
                          value={ag.jobTitle}
                          onChange={e => {
                            const newGuests = [...additionalGuests];
                            newGuests[index].jobTitle = e.target.value;
                            setAdditionalGuests(newGuests);
                          }}
                          className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {formError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">"""

    content = content.replace(old_ui, new_ui)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/GuestRSVP.tsx")
