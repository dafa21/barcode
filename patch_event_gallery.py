import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Add gallery to destructuring
    content = content.replace("letterContent, backsound, heroImage } = req.body;", "letterContent, backsound, heroImage, gallery } = req.body;")
    
    # Add gallery to inserts and updates
    content = content.replace("heroImage,", "heroImage,\n      gallery,")

    with open(filepath, "w") as f:
        f.write(content)

patch("src/modules/events/event.routes.ts")
patch("src/modules/guests/guest.routes.ts")
