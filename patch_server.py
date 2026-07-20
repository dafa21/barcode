import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    content = content.replace("app.get('*all', (req, res) => {", "app.get('*', (req, res) => {")

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("server.ts")
