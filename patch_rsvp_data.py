import sys
import re

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_event = r"    letterBackground\?: string \| null;\n    letterContent\?: string \| null;\n    gallery\?: string \| null;\n  };"
    new_event = r"    letterBackground?: string | null;\n    letterContent?: string | null;\n    gallery?: string | null;\n    themePrimary?: string | null;\n    themeSecondary?: string | null;\n  };"

    content = re.sub(old_event, new_event, content)

    old_invitation = r"        gallery=\{data\.event\.gallery \|\| '\[\]'\}\n        isPreview=\{false\}"
    new_invitation = r"        gallery={data.event.gallery || '[]'}\n        themePrimary={data.event.themePrimary}\n        themeSecondary={data.event.themeSecondary}\n        isPreview={false}"

    content = re.sub(old_invitation, new_invitation, content)
    
    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/GuestRSVP.tsx")
