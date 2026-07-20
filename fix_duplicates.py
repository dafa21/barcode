import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # The payload has:
    # letterContent: newEventLetterContent,
    # heroImage: newEventHeroImage,
    # backsound: newEventBacksound,
    # heroImage: newEventHeroImage,
    # backsound: newEventBacksound
    
    content = content.replace(
        "letterContent: newEventLetterContent,\n          heroImage: newEventHeroImage,\n          backsound: newEventBacksound,\n          heroImage: newEventHeroImage,\n          backsound: newEventBacksound",
        "letterContent: newEventLetterContent,\n          heroImage: newEventHeroImage,\n          backsound: newEventBacksound"
    )

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
