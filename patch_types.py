import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Add isVip to Guest type
    old_type = "  rsvpStatus?: 'pending' | 'attending' | 'not_attending';"
    new_type = "  rsvpStatus?: 'pending' | 'attending' | 'not_attending';\n  isVip?: boolean;"
    content = content.replace(old_type, new_type)

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/types.ts")
