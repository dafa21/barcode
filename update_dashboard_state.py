import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Import DigitalInvitation
    content = content.replace(
        "import ReactQuill from 'react-quill-new';",
        "import ReactQuill from 'react-quill-new';\nimport { DigitalInvitation } from './DigitalInvitation.tsx';"
    )

    # Add state hooks
    content = content.replace(
        "const [newEventLetterContent, setNewEventLetterContent] = useState('');",
        "const [newEventLetterContent, setNewEventLetterContent] = useState('');\n  const [newEventHeroImage, setNewEventHeroImage] = useState<string | null>(null);\n  const [newEventBacksound, setNewEventBacksound] = useState<string | null>(null);"
    )
    
    # Update selectEvent
    content = content.replace(
        "setNewEventLetterContent(event.letterContent || '');",
        "setNewEventLetterContent(event.letterContent || '');\n    setNewEventHeroImage(event.heroImage || null);\n    setNewEventBacksound(event.backsound || null);"
    )
    
    # Update update event payload
    content = content.replace(
        "letterSize: newEventLetterSize,\n          letterContent: newEventLetterContent",
        "letterSize: newEventLetterSize,\n          letterContent: newEventLetterContent,\n          heroImage: newEventHeroImage,\n          backsound: newEventBacksound"
    )
    
    # Reset update event state
    content = content.replace(
        "setNewEventLetterSize('A4');\n        fetchEvents();",
        "setNewEventLetterSize('A4');\n        setNewEventHeroImage(null);\n        setNewEventBacksound(null);\n        fetchEvents();"
    )

    # Update create event payload
    content = content.replace(
        "letterSize: newEventLetterSize,\n          letterContent: newEventLetterContent",
        "letterSize: newEventLetterSize,\n          letterContent: newEventLetterContent,\n          heroImage: newEventHeroImage,\n          backsound: newEventBacksound"
    )
    
    # Reset create event state
    content = content.replace(
        "setNewEventLetterSize('A4');\n        setNewEventLetterContent('');\n        fetchEvents();",
        "setNewEventLetterSize('A4');\n        setNewEventLetterContent('');\n        setNewEventHeroImage(null);\n        setNewEventBacksound(null);\n        fetchEvents();"
    )

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
