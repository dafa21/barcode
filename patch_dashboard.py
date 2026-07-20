import sys
import re

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # state variables
    old_state = r"const \[newEventGallery, setNewEventGallery\] = useState<string\[\]>\(\[\]\);"
    new_state = r"const [newEventGallery, setNewEventGallery] = useState<string[]>([]);\n  const [newEventThemePrimary, setNewEventThemePrimary] = useState('#b45309');\n  const [newEventThemeSecondary, setNewEventThemeSecondary] = useState('#fef3c7');"
    
    content = re.sub(old_state, new_state, content)

    # submit
    old_submit = r"gallery: JSON\.stringify\(newEventGallery\)\n\s*}\)"
    new_submit = r"gallery: JSON.stringify(newEventGallery),\n          themePrimary: newEventThemePrimary,\n          themeSecondary: newEventThemeSecondary\n        })"
    content = re.sub(old_submit, new_submit, content)

    # edit
    old_edit = r"setNewEventGallery\(event\.gallery \? JSON\.parse\(event\.gallery\) : \[\]\);"
    new_edit = r"setNewEventGallery(event.gallery ? JSON.parse(event.gallery) : []);\n      setNewEventThemePrimary(event.themePrimary || '#b45309');\n      setNewEventThemeSecondary(event.themeSecondary || '#fef3c7');"
    content = re.sub(old_edit, new_edit, content)

    # clear
    old_clear = r"setNewEventGallery\(\[\]\);"
    new_clear = r"setNewEventGallery([]);\n      setNewEventThemePrimary('#b45309');\n      setNewEventThemeSecondary('#fef3c7');"
    content = re.sub(old_clear, new_clear, content)

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/OfficeAdminDashboard.tsx")
