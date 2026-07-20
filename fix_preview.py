import sys
import re

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    new_preview = """
                            {/* Live Preview Letter */}
                            {(newEventLetterContent || newEventLetterBackground || newEventHeroImage) && (
                                <div className="mt-4 border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50/50">
                                  <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">Live Preview Undangan Digital</h4>
                                  <div className="w-full relative mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transform scale-[0.8] origin-top h-[600px] overflow-y-auto">
                                    <DigitalInvitation 
                                      eventName={newEventName || 'Nama Acara'}
                                      eventDate={newEventDate || new Date().toISOString()}
                                      location={newEventLocation || 'Lokasi Acara'}
                                      guestName="Nama Tamu Preview"
                                      heroImage={newEventHeroImage}
                                      background={newEventLetterBackground}
                                      content={newEventLetterContent}
                                      backsound={newEventBacksound}
                                      isPreview={true}
                                    />
                                  </div>
                                </div>
                            )}
"""
    
    # Replace the preview block in create form
    # We use regex to match the old block
    content = re.sub(
        r'\{\/\* Live Preview Letter \*\/\}.*?Live Preview Surat<\/h4>.*?<div\s+className="relative z-10 text-xs text-gray-800 font-serif leading-relaxed ql-editor !p-0".*?\/>\s*<\/div>\s*<\/div>\s*\)\}',
        new_preview.strip(),
        content,
        flags=re.DOTALL
    )

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
