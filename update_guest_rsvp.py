import sys
import re

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Import DigitalInvitation
    content = content.replace(
        "import { CheckCircle2, XCircle, MapPin, Calendar as CalendarIcon, Users, FileText, X } from 'lucide-react';",
        "import { CheckCircle2, XCircle, MapPin, Calendar as CalendarIcon, Users, FileText, X, Music } from 'lucide-react';\nimport { DigitalInvitation } from './DigitalInvitation.tsx';"
    )

    # Add backsound and heroImage to event type in RSVPData
    content = content.replace(
        "twibbonConfig?: string | null;",
        "twibbonConfig?: string | null;\n    backsound?: string | null;\n    heroImage?: string | null;\n    letterBackground?: string | null;\n    letterContent?: string | null;"
    )

    # Add state for showing digital invitation
    content = content.replace(
        "const [isGeneratingTwibbon, setIsGeneratingTwibbon] = useState(false);",
        "const [isGeneratingTwibbon, setIsGeneratingTwibbon] = useState(false);\n  const [showDigitalInvitation, setShowDigitalInvitation] = useState(true);"
    )

    # Change the initial state of isLetterOpen (or just remove the letter modal and replace with digital invitation overlay)
    # The guest RSVP UI: Let's make the Digital Invitation the main page, and RSVP is an overlay/bottom sheet,
    # OR Digital Invitation is an overlay when they click a button. Let's make the page the digital invitation, and RSVP is below it!
    
    new_ui = """
      {/* Digital Invitation Header */}
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
      <div className="max-w-2xl mx-auto w-full p-6 mt-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
"""
    
    # We will replace the start of the return JSX
    # Currently it starts with:
    # return (
    #   <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4 py-12">
    #     <div className="max-w-md w-full">
    
    content = re.sub(
        r'return \(\s*<div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4 py-12">\s*<div className="max-w-md w-full">',
        'return (\n    <div className="min-h-screen bg-gray-50/50 flex flex-col items-center pb-12 w-full">\n' + new_ui,
        content
    )

    # Replace the "Lihat Surat Undangan" button with "Lihat Undangan Digital" (actually we already show it at the top, so we can hide this button or make it scroll up)
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

    # Remove the whole isLetterOpen modal JSX
    content = re.sub(
        r'\{isLetterOpen && \(.*?<\/div>\s*\)\}',
        '',
        content,
        flags=re.DOTALL
    )

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/GuestRSVP.tsx")
