import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # 1. State for invitation
    old_state = """  const [newEventLogo, setNewEventLogo] = useState<string | undefined>(undefined);"""
    
    new_state = """  const [newEventLogo, setNewEventLogo] = useState<string | undefined>(undefined);
  const [newEventInvitationFile, setNewEventInvitationFile] = useState<string | null>(null);"""
    content = content.replace(old_state, new_state)

    # 2. Add event body (if missing)
    old_add_body = """        body: JSON.stringify({ 
          eventName: newEventName, 
          eventDate: newEventDate, 
          location: newEventLocation,
          logo: newEventLogo
        })"""
    new_add_body = """        body: JSON.stringify({ 
          eventName: newEventName, 
          eventDate: newEventDate, 
          location: newEventLocation,
          logo: newEventLogo,
          invitationFile: newEventInvitationFile
        })"""
    content = content.replace(old_add_body, new_add_body)

    # 3. Add success reset
    old_reset = """        setNewEventLocation("");
        setNewEventLogo(undefined);
        setIsAddEventModalOpen(false);"""
    new_reset = """        setNewEventLocation("");
        setNewEventLogo(undefined);
        setNewEventInvitationFile(null);
        setIsAddEventModalOpen(false);"""
    content = content.replace(old_reset, new_reset)

    # 4. Open edit modal
    old_edit_open = """                          setNewEventLocation(event.location || "");
                          setNewEventLogo(event.logo || undefined);
                          setEditingEventId(event.id);
                          setIsEditEventModalOpen(true);"""
    new_edit_open = """                          setNewEventLocation(event.location || "");
                          setNewEventLogo(event.logo || undefined);
                          setNewEventInvitationFile(event.invitationFile || null);
                          setEditingEventId(event.id);
                          setIsEditEventModalOpen(true);"""
    content = content.replace(old_edit_open, new_edit_open)

    # 6. Update event reset
    old_update_reset = """        setNewEventLocation("");
        setNewEventLogo(undefined);
        fetchEvents();"""
    new_update_reset = """        setNewEventLocation("");
        setNewEventLogo(undefined);
        setNewEventInvitationFile(null);
        fetchEvents();"""
    content = content.replace(old_update_reset, new_update_reset)


    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
