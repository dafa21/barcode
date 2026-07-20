import sys
import re

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_props = r"  gallery\?: string;\n  isPreview\?: boolean;\n  isPrint\?: boolean;\n  children\?: React\.ReactNode;\n\}"
    new_props = r"  gallery?: string;\n  themePrimary?: string | null;\n  themeSecondary?: string | null;\n  isPreview?: boolean;\n  isPrint?: boolean;\n  children?: React.ReactNode;\n}"

    content = re.sub(old_props, new_props, content)

    old_func = r"  gallery,\n  isPreview = false,\n  isPrint = false,\n  children\n\}: Props\) \{"
    new_func = r"  gallery,\n  themePrimary,\n  themeSecondary,\n  isPreview = false,\n  isPrint = false,\n  children\n}: Props) {"

    content = re.sub(old_func, new_func, content)

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/DigitalInvitation.tsx")
