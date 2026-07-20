import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_sidebar = 'className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col min-h-[300px] max-h-[70vh] lg:max-h-none lg:h-[calc(100vh-12rem)] shadow-sm"'
    new_sidebar = 'className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col lg:h-[calc(100vh-12rem)] shadow-sm"'
    content = content.replace(old_sidebar, new_sidebar)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
