import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # We replaced h-96 with h-[500px] before. Let's replace h-[500px] with max-h-[70vh] min-h-[300px]
    old_sidebar = 'className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px] lg:h-[calc(100vh-12rem)] shadow-sm"'
    new_sidebar = 'className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col min-h-[300px] max-h-[70vh] lg:max-h-none lg:h-[calc(100vh-12rem)] shadow-sm"'
    content = content.replace(old_sidebar, new_sidebar)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
