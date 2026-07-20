import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Add isVip to guests
    old_guest = "  rsvpStatus: rsvpEnum('rsvp_status').default('pending'),"
    new_guest = "  rsvpStatus: rsvpEnum('rsvp_status').default('pending'),\n  isVip: boolean('is_vip').default(false),"
    content = content.replace(old_guest, new_guest)

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/db/schema.ts")
