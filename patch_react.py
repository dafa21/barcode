import sys
import re

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    if "import React" not in content:
        content = content.replace("from 'react';", "from 'react';\nimport React from 'react';")

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/GuestRSVP.tsx")
patch("src/components/DigitalInvitation.tsx")
