import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # We need to replace everything from `return (` downwards.
    # Let's find `return (`
    start_idx = content.find("  return (\n    <div className=\"min-h-screen")
    if start_idx == -1:
        # try another pattern
        start_idx = content.find("  return (\n        <div className=\"min-h-screen")
        
    if start_idx == -1:
        print("Could not find start idx")
        return

    new_return = """  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center w-full overflow-x-hidden">
      <DigitalInvitation
        eventName={data.event.eventName}
        eventDate={data.event.eventDate}
        location={data.event.location}
        guestName={data.guestName}
        heroImage={data.event.heroImage || null}
        background={data.event.letterBackground || null}
        content={data.event.letterContent || ''}
        backsound={data.event.backsound || null}
        gallery={data.event.gallery || '[]'}
        isPreview={false}
      >
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-100 text-center w-full relative">
          <p className="text-[10px] tracking-widest uppercase text-gray-500 mb-2 font-sans font-semibold">Invitation For</p>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{data.guestName}</h2>
          {data.company && <p className="text-xs text-gray-500 mb-6">{data.company}</p>}
          {!data.company && <div className="mb-6"></div>}
          
          {success ? (
            <div className="bg-amber-50/50 p-6 rounded-xl border border-amber-100 animate-in fade-in zoom-in duration-300">
              {data.rsvpStatus === 'attending' ? (
                <>
                  <CheckCircle2 className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1 font-serif">RSVP Confirmed!</h3>
                  <p className="text-gray-600 text-xs mb-6">Thank you for confirming your attendance.</p>
                  
                  {isGeneratingTwibbon ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-3">
                      <div className="w-6 h-6 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Generating ID Card...</p>
                    </div>
                  ) : generatedTwibbon ? (
                    <div className="w-full max-w-[280px] mx-auto mt-2">
                      <img src={generatedTwibbon} alt="Guest ID Card" className="w-full h-auto rounded-xl shadow-lg border border-gray-100" />
                      <a
                        href={generatedTwibbon}
                        download={`${data.guestName.replace(/\\s+/g, "_")}_ID_Card.png`}
                        className="mt-4 block w-full py-3 bg-amber-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-amber-800 transition-colors shadow-md"
                      >
                        Download ID Card
                      </a>
                    </div>
                  ) : (
                    <div className="mt-2 py-2 px-4 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold inline-block border border-amber-200">
                      {data.paxCount} Guest(s)
                    </div>
                  )}
                </>
              ) : (
                <>
                  <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1 font-serif">RSVP Confirmed</h3>
                  <p className="text-gray-600 text-xs">We're sorry you won't be able to make it.</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-3 text-left">
                  How many people will be attending?
                </label>
                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200 focus-within:border-amber-300 focus-within:ring-2 focus-within:ring-amber-100 transition-all">
                  <Users className="w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={paxInput}
                    onChange={(e) => setPaxInput(e.target.value)}
                    className="w-full bg-transparent outline-none text-base font-medium text-gray-900"
                  />
                </div>
              </div>
              
              {pax > 1 && (
                <div className="space-y-4 pt-4 border-t border-gray-100 text-left">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Detail Tamu Tambahan</h3>
                  <p className="text-[10px] text-gray-500 mb-4 leading-relaxed">Mohon isi data tamu tambahan yang akan hadir bersama Anda.</p>
                  
                  {additionalGuests.map((ag, index) => (
                    <div key={index} className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 space-y-3">
                      <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">Tamu #{index + 2}</p>
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-gray-600 mb-1">Nama Lengkap *</label>
                        <input 
                          type="text"
                          required
                          value={ag.guestName}
                          onChange={e => {
                            const newGuests = [...additionalGuests];
                            newGuests[index].guestName = e.target.value;
                            setAdditionalGuests(newGuests);
                          }}
                          className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-gray-600 mb-1">No. WhatsApp *</label>
                        <input 
                          type="tel"
                          required
                          value={ag.phone}
                          onChange={e => {
                            const newGuests = [...additionalGuests];
                            newGuests[index].phone = e.target.value;
                            setAdditionalGuests(newGuests);
                          }}
                          className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-gray-600 mb-1">Jabatan (Opsional)</label>
                        <input 
                          type="text"
                          value={ag.jobTitle}
                          onChange={e => {
                            const newGuests = [...additionalGuests];
                            newGuests[index].jobTitle = e.target.value;
                            setAdditionalGuests(newGuests);
                          }}
                          className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {formError && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-200 text-left">
                  {formError}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleSubmit('not_attending')}
                  disabled={submitting}
                  className="px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] border-2 border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Can't Make It
                </button>
                <button
                  onClick={() => handleSubmit('attending')}
                  disabled={submitting}
                  className="px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] bg-amber-700 text-white shadow-md shadow-amber-200 hover:bg-amber-800 hover:shadow-lg transition-all disabled:opacity-50 disabled:transform-none active:scale-95"
                >
                  Confirm RSVP
                </button>
              </div>
            </div>
          )}
        </div>
      </DigitalInvitation>
    </div>
  );
}
"""
    
    content = content[:start_idx] + new_return
    with open(filepath, "w") as f:
        f.write(content)

patch("src/components/GuestRSVP.tsx")
