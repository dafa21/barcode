import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Add style to root div
    old_div = '<div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center w-full overflow-x-hidden">'
    new_div = '<div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center w-full overflow-x-hidden" style={{ "--theme-primary": data.event.themePrimary || "#b45309", "--theme-secondary": data.event.themeSecondary || "#fef3c7" } as React.CSSProperties}>'
    content = content.replace(old_div, new_div)

    # Replace amber classes in GuestRSVP
    content = content.replace('bg-amber-50/50', 'bg-[var(--theme-secondary)] opacity-50')
    content = content.replace('border-amber-100', 'border-[var(--theme-secondary)]')
    content = content.replace('text-amber-600', 'text-[var(--theme-primary)]')
    content = content.replace('border-amber-200', 'border-[var(--theme-primary)] opacity-40')
    content = content.replace('border-t-amber-600', 'border-t-[var(--theme-primary)]')
    content = content.replace('bg-amber-700', 'bg-[var(--theme-primary)]')
    content = content.replace('hover:bg-amber-800', 'hover:bg-[var(--theme-primary)] hover:brightness-90')
    content = content.replace('shadow-amber-200', 'shadow-[var(--theme-secondary)]')
    content = content.replace('bg-amber-100', 'bg-[var(--theme-secondary)]')
    content = content.replace('text-amber-800', 'text-[var(--theme-primary)]')
    content = content.replace('focus-within:border-amber-300', 'focus-within:border-[var(--theme-primary)]')
    content = content.replace('focus-within:ring-amber-100', 'focus-within:ring-[var(--theme-secondary)]')
    content = content.replace('focus:border-amber-300', 'focus:border-[var(--theme-primary)]')
    content = content.replace('focus:ring-amber-100', 'focus:ring-[var(--theme-secondary)]')

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/GuestRSVP.tsx")
