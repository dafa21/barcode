import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # The modal code starts with "{/* Letter Print Modal */}" and ends with "      )}\n"
    modal_start = "{/* Letter Print Modal */}"
    idx1 = content.find(modal_start)
    if idx1 == -1:
        return
    idx2 = content.find("      )}\n\n  );\n}", idx1)
    if idx2 == -1:
        return
        
    modal_code = content[idx1:idx2 + 8] # up to "      )}\n"
    
    # remove the existing modal
    content = content[:idx1] + "\n  );\n}"
    
    # now insert modal before "    </>"
    idx3 = content.rfind("    </>\n  );\n}")
    if idx3 != -1:
        content = content[:idx3] + modal_code + "\n" + content[idx3:]

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
