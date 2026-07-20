import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Fix border-[var(--theme-primary)] opacity-40
    content = content.replace('border-[var(--theme-primary)] opacity-40', 'border-[var(--theme-primary)]/40')

    # Also bg-[var(--theme-secondary)] opacity-50
    content = content.replace('bg-[var(--theme-secondary)] opacity-50', 'bg-[var(--theme-secondary)]')

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/GuestRSVP.tsx")
