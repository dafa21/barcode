import sys
import re

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Update POST /
    old_post = r"letterContent, backsound, heroImage,\n      gallery \} = req\.body;"
    new_post = r"letterContent, backsound, heroImage,\n      gallery, themePrimary, themeSecondary } = req.body;"
    content = re.sub(old_post, new_post, content)

    old_insert = r"heroImage,\n      gallery,\n    \}\)\.returning"
    new_insert = r"heroImage,\n      gallery,\n      themePrimary,\n      themeSecondary,\n    }).returning"
    content = re.sub(old_insert, new_insert, content)

    # Update PUT /:id
    old_put = r"letterContent, backsound, heroImage, gallery \} = req\.body;"
    new_put = r"letterContent, backsound, heroImage, gallery, themePrimary, themeSecondary } = req.body;"
    content = re.sub(old_put, new_put, content)

    old_update = r"heroImage,\n      gallery,\n    \}\)\.where"
    new_update = r"heroImage,\n      gallery,\n      themePrimary,\n      themeSecondary,\n    }).where"
    content = re.sub(old_update, new_update, content)

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/modules/events/event.routes.ts")
