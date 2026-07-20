import sys
import re

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Update POST
    old_post = r"const \{ eventId, guestName, email, phone, company, jobTitle, picId \} = req\.body;"
    new_post = r"const { eventId, guestName, email, phone, company, jobTitle, picId, isVip } = req.body;"
    content = re.sub(old_post, new_post, content)

    old_insert = r"      picId,\n      barcodeUid,\n    \}\)\.returning\(\);"
    new_insert = r"      picId,\n      barcodeUid,\n      isVip,\n    }).returning();"
    content = re.sub(old_insert, new_insert, content)

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/modules/guests/guest.routes.ts")
