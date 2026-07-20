import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # We will modify the live preview and the print preview
    # to use ql-editor
    content = content.replace(
        'className="relative z-10 text-xs text-gray-800 font-serif leading-relaxed"',
        'className="relative z-10 text-xs text-gray-800 font-serif leading-relaxed ql-editor !p-0"'
    )
    content = content.replace(
        'className="relative z-10 font-serif text-gray-800 leading-relaxed whitespace-pre-wrap"',
        'className="relative z-10 text-xs font-serif text-gray-800 leading-relaxed whitespace-pre-wrap ql-editor !p-0"'
    )
    
    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
