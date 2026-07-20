import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    base_url_func = """
const getBaseUrl = () => {
  const origin = window.location.origin;
  if (origin.includes('aistudio.google.com') || origin.includes('ais-dev-')) {
    return 'https://ais-pre-zf5i2wwg3sbzzeqtrus6hh-702811290214.asia-east1.run.app';
  }
  return origin;
};
"""
    
    # insert after imports
    content = content.replace("import ReactQuill from 'react-quill-new';", "import ReactQuill from 'react-quill-new';\n" + base_url_func)

    # replace window.location.origin
    content = content.replace("${window.location.origin}", "${getBaseUrl()}")

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/OfficeAdminDashboard.tsx")
