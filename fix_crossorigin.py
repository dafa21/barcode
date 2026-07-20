import glob

def fix_file(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Find the places where crossOrigin is set for bgImg and logoImg
    content = content.replace(
        'bgImg.crossOrigin = "anonymous";',
        'if (background.startsWith("http")) { bgImg.crossOrigin = "anonymous"; }'
    )
    content = content.replace(
        'logoImg.crossOrigin = "anonymous";',
        'if (logoSrc.startsWith("http")) { logoImg.crossOrigin = "anonymous"; }'
    )
    
    with open(filepath, "w") as f:
        f.write(content)

fix_file("src/components/TwibbonConfigurator.tsx")
fix_file("src/components/OfficeAdminDashboard.tsx")
