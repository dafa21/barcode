import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    content = content.replace('className=\\"', 'className="')
    content = content.replace('\\">', '">')

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/Scanner.tsx")
