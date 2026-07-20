import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Add imports
    content = content.replace("import 'react-quill/dist/quill.snow.css';", "import 'react-quill-new/dist/quill.snow.css';")
    
    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
