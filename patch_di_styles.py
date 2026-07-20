import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Add style to root div
    old_div = '<div className="relative w-full max-w-md mx-auto min-h-screen flex flex-col shadow-2xl overflow-hidden font-wedding text-center bg-[#fdfbf7]">'
    new_div = '<div className="relative w-full max-w-md mx-auto min-h-screen flex flex-col shadow-2xl overflow-hidden font-wedding text-center bg-[#fdfbf7]" style={{ "--theme-primary": themePrimary || "#b45309", "--theme-secondary": themeSecondary || "#fef3c7" } as React.CSSProperties}>'
    content = content.replace(old_div, new_div)

    # Line 192: text-amber-800
    content = content.replace('text-amber-800', 'text-[var(--theme-primary)]')

    # Line 196, 275, 277: bg-amber-200
    content = content.replace('bg-amber-200', 'bg-[var(--theme-primary)] opacity-40')

    # Line 219, 235: text-amber-600
    content = content.replace('text-amber-600', 'text-[var(--theme-primary)] opacity-90')

    # Line 221, 237: text-amber-800/60
    content = content.replace('text-amber-800/60', 'text-[var(--theme-primary)] opacity-60')

    # Line 242: bg-amber-50
    content = content.replace('bg-amber-50', 'bg-[var(--theme-secondary)]')

    # Line 243: text-amber-300
    content = content.replace('text-amber-300', 'text-[var(--theme-primary)] opacity-40')

    # Line 244: text-amber-600/70
    content = content.replace('text-amber-600/70', 'text-[var(--theme-primary)] opacity-70')

    # Line 246: text-amber-700, border-amber-100, hover:bg-amber-50
    content = content.replace('text-amber-700', 'text-[var(--theme-primary)]')
    content = content.replace('border-amber-100', 'border-[var(--theme-secondary)]')
    content = content.replace('hover:bg-amber-50', 'hover:bg-[var(--theme-secondary)]')

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/DigitalInvitation.tsx")
