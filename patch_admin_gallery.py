import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Add state
    content = content.replace(
        "const [newEventBacksound, setNewEventBacksound] = useState<string | null>(null);",
        "const [newEventBacksound, setNewEventBacksound] = useState<string | null>(null);\n  const [newEventGallery, setNewEventGallery] = useState<string[]>([]);"
    )

    # In selectEvent
    content = content.replace(
        "setNewEventBacksound(event.backsound || null);",
        "setNewEventBacksound(event.backsound || null);\n    try { setNewEventGallery(event.gallery ? JSON.parse(event.gallery) : []); } catch(e) { setNewEventGallery([]); }"
    )

    # In API payload (create and update)
    # The payload uses JSON.stringify, we can just pass JSON.stringify(newEventGallery) for gallery
    content = content.replace(
        "backsound: newEventBacksound",
        "backsound: newEventBacksound,\n          gallery: JSON.stringify(newEventGallery)"
    )

    # In reset states (there are two)
    content = content.replace(
        "setNewEventBacksound(null);",
        "setNewEventBacksound(null);\n        setNewEventGallery([]);"
    )

    with open(filepath, "w") as f:
        f.write(content)

patch("src/components/OfficeAdminDashboard.tsx")
