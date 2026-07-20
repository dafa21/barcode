import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Add isPrint prop
    content = content.replace("isPreview?: boolean;", "isPreview?: boolean;\n  isPrint?: boolean;")
    content = content.replace("isPreview = false", "isPreview = false,\n  isPrint = false")
    
    # Disable animations if isPrint is true
    # For now, just render static tags if isPrint is true
    # A simpler way is to just let framer-motion run, it will complete in 1 sec.
    # Actually, we can just replace `<motion.div` with `div` or set `initial=false` when isPrint is true.
    # Wait, framer-motion `animate` might not render correctly in html2canvas if we don't wait.
    content = content.replace("initial={{ opacity: 0, y: -20 }}", "initial={isPrint ? false : { opacity: 0, y: -20 }}")
    content = content.replace("initial={{ opacity: 0, scale: 0.9 }}", "initial={isPrint ? false : { opacity: 0, scale: 0.9 }}")
    content = content.replace("initial={{ opacity: 0 }}", "initial={isPrint ? false : { opacity: 0 }}")
    content = content.replace("initial={{ opacity: 0, y: 20 }}", "initial={isPrint ? false : { opacity: 0, y: 20 }}")

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/DigitalInvitation.tsx")
