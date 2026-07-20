import sys
import re

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    new_ui = """
    <div className="min-h-screen bg-gray-50/50 flex flex-col items-center pb-12 w-full overflow-x-hidden">
      {/* Digital Invitation Section */}
      {showDigitalInvitation && (
        <div className="w-full">
          <DigitalInvitation
            eventName={data.event.eventName}
            eventDate={data.event.eventDate}
            location={data.event.location}
            guestName={data.guestName}
            heroImage={data.event.heroImage || null}
            background={data.event.letterBackground || null}
            content={data.event.letterContent || ''}
            backsound={data.event.backsound || null}
            isPreview={false}
          />
        </div>
      )}

      {/* RSVP Form Section */}
      <div className="max-w-2xl mx-auto w-full px-4 mt-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
"""
    
    content = re.sub(
        r'<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">\s*<div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">',
        new_ui,
        content
    )

    # Now replace "Lihat Surat Undangan" button text
    content = content.replace(
        '<button onClick={() => setIsLetterOpen(true)} className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">',
        '<button onClick={() => window.scrollTo({top: 0, behavior: \'smooth\'})} className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">'
    )
    content = content.replace(
        '<FileText className="w-4 h-4" />',
        '<Music className="w-4 h-4" />'
    )
    content = content.replace(
        'Lihat Surat',
        'Lihat Undangan'
    )

    # Remove the isLetterOpen JSX
    content = re.sub(
        r'\{isLetterOpen && \(.*?\)\}\s*<\/div>\s*\);\s*\}',
        '\n    </div>\n  );\n}',
        content,
        flags=re.DOTALL
    )

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/GuestRSVP.tsx")
