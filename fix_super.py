import sys

def replace_responsive(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # The layout wrapper
    content = content.replace(
        'h-[calc(100vh-10rem)]',
        'h-auto lg:h-[calc(100vh-10rem)] min-h-0'
    )
    
    with open(filepath, "w") as f:
        f.write(content)

replace_responsive("src/components/SuperAdminDashboard.tsx")
