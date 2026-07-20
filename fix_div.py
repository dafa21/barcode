import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    content = content.replace(
        "          )}\n        </div>\n      </div>\n\n      \n    </div>\n  );\n}",
        "          )}\n        </div>\n      </div>\n      </div>\n    </div>\n  );\n}"
    )

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/GuestRSVP.tsx")
