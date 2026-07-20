import sys
import re

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Import Upload and FileText
    content = content.replace("Crown } from 'lucide-react';", "Crown, Upload, FileText } from 'lucide-react';")

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/OfficeAdminDashboard.tsx")
