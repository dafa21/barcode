import sys
import re

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # We need to replace gallery={JSON.stringify(newEventGallery)} with gallery={JSON.stringify(newEventGallery)} themePrimary={newEventThemePrimary} themeSecondary={newEventThemeSecondary}
    old_preview = r"gallery=\{JSON\.stringify\(newEventGallery\)\}\n\s+isPreview=\{true\}"
    new_preview = r"gallery={JSON.stringify(newEventGallery)}\n                                      themePrimary={newEventThemePrimary}\n                                      themeSecondary={newEventThemeSecondary}\n                                      isPreview={true}"

    content = re.sub(old_preview, new_preview, content)

    # For the printing one:
    old_print = r"backsound=\{selectedEvent\.backsound \|\| null\}\n\s+isPreview=\{true\}"
    new_print = r"backsound={selectedEvent.backsound || null}\n                  themePrimary={selectedEvent.themePrimary || null}\n                  themeSecondary={selectedEvent.themeSecondary || null}\n                  isPreview={true}"
    
    content = re.sub(old_print, new_print, content)

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/OfficeAdminDashboard.tsx")
