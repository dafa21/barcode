import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # We will modify the POST and PUT routes to include the new fields
    content = content.replace(
        'letterContent } = req.body;',
        'letterContent, backsound, heroImage } = req.body;'
    )
    content = content.replace(
        '      letterContent,',
        '      letterContent,\n      backsound,\n      heroImage,'
    )
    
    with open(filepath, "w") as f:
        f.write(content)

modify("src/modules/events/event.routes.ts")
