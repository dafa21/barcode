import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    content = content.replace('className="flex justify-center mt-4"', 'className="flex items-center justify-center mt-4 gap-2"')

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/Scanner.tsx")
