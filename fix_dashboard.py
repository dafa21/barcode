import sys

def replace_responsive(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Fix padding
    content = content.replace(
        'px-8 flex items-center justify-between',
        'px-4 md:px-8 flex items-center justify-between gap-4'
    )
    content = content.replace(
        'p-8 max-w-[1400px]',
        'p-4 md:p-8 max-w-[1400px]'
    )
    
    # Optional: shrink text size slightly on very small screens or make it wrap
    
    with open(filepath, "w") as f:
        f.write(content)

replace_responsive("src/components/Dashboard.tsx")

