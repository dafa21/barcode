import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Add imports
    content = content.replace("import ReactQuill from 'react-quill';", "import ReactQuill from 'react-quill-new';")
    
    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
