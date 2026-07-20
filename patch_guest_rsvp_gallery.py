import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    content = content.replace("backsound={data.event.backsound || null}", "backsound={data.event.backsound || null}\n            gallery={data.event.gallery || '[]'}")
    
    # Also add gallery to RSVPData type
    content = content.replace("letterContent?: string | null;", "letterContent?: string | null;\n    gallery?: string | null;")

    with open(filepath, "w") as f:
        f.write(content)

patch("src/components/GuestRSVP.tsx")
