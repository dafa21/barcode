import sys
import re

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_update = r"      gallery,\n      \}\)\n      \.where"
    new_update = r"      gallery,\n      themePrimary,\n      themeSecondary,\n      })\n      .where"
    
    content = re.sub(old_update, new_update, content)

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/modules/events/event.routes.ts")
