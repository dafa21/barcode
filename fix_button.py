import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    content = content.replace(
        "setIsLetterOpen(true)",
        "window.scrollTo({top: 0, behavior: 'smooth'})"
    )
    content = content.replace(
        "Lihat Undangan Undangan Resmi",
        "Lihat Undangan Digital"
    )

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/GuestRSVP.tsx")
