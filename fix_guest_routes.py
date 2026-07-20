import sys
import re

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    new_event_fields = """
        logo: events.logo,
        twibbonBackground: events.twibbonBackground,
        twibbonConfig: events.twibbonConfig,
        backsound: events.backsound,
        heroImage: events.heroImage,
        letterBackground: events.letterBackground,
        letterContent: events.letterContent
"""

    content = re.sub(
        r'logo:\s*events\.logo,\s*twibbonBackground:\s*events\.twibbonBackground,\s*twibbonConfig:\s*events\.twibbonConfig',
        new_event_fields.strip(),
        content
    )

    with open(filepath, "w") as f:
        f.write(content)

modify("src/modules/guests/guest.routes.ts")
