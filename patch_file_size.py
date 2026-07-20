import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # We need to add a check for file.size > 800 * 1024
    old_pdf_change = """                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setNewEventInvitationFile(reader.result as string);
                        reader.readAsDataURL(file);
                      } else {"""
    new_pdf_change = """                      if (file) {
                        if (file.size > 800 * 1024) {
                          alert("Ukuran file undangan maksimal adalah 800KB. Silakan kompres PDF Anda terlebih dahulu.");
                          e.target.value = '';
                          return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = () => setNewEventInvitationFile(reader.result as string);
                        reader.readAsDataURL(file);
                      } else {"""
    content = content.replace(old_pdf_change, new_pdf_change)

    # There are two places (Create and Edit)
    # Wait, the replace above should replace both occurrences if they are exactly the same.
    # Let's check if the replacement happened.
    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
