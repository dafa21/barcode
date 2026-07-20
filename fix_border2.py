import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    content = content.replace('border-[var(--theme-primary)]/40', 'border-[var(--theme-secondary)]')

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/GuestRSVP.tsx")
