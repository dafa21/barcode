import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    content = content.replace('text-[var(--theme-primary)]/60', 'text-[var(--theme-primary)] opacity-60')
    content = content.replace('text-[var(--theme-primary)] opacity-90/70', 'text-[var(--theme-primary)] opacity-70')

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/DigitalInvitation.tsx")
