import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_click = """                        setNewEventLocation(selectedEvent.location || '');
                        setNewEventLogo(selectedEvent.logo || undefined);
                        setIsEditEventModalOpen(true);"""
    new_click = """                        setNewEventLocation(selectedEvent.location || '');
                        setNewEventLogo(selectedEvent.logo || undefined);
                        setNewEventInvitationFile(selectedEvent.invitationFile || null);
                        setIsEditEventModalOpen(true);"""
    
    content = content.replace(old_click, new_click)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
