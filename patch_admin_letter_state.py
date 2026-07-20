import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Find the newEventInvitationFile state
    old_state = """  const [newEventInvitationFile, setNewEventInvitationFile] = useState<string | null>(null);"""
    
    new_state = """  const [newEventInvitationFile, setNewEventInvitationFile] = useState<string | null>(null);
  const [newEventLetterBackground, setNewEventLetterBackground] = useState<string | null>(null);
  const [newEventLetterSize, setNewEventLetterSize] = useState<'A4' | 'LETTER'>('A4');
  const [newEventLetterContent, setNewEventLetterContent] = useState('');
  const [printingGuest, setPrintingGuest] = useState<any | null>(null);"""
    content = content.replace(old_state, new_state)

    old_add_body = """          logo: newEventLogo,
          invitationFile: newEventInvitationFile
        })"""
    new_add_body = """          logo: newEventLogo,
          invitationFile: newEventInvitationFile,
          letterBackground: newEventLetterBackground,
          letterSize: newEventLetterSize,
          letterContent: newEventLetterContent
        })"""
    content = content.replace(old_add_body, new_add_body)

    old_reset = """        setNewEventLogo(undefined);
        setNewEventInvitationFile(null);
        fetchEvents();"""
    new_reset = """        setNewEventLogo(undefined);
        setNewEventInvitationFile(null);
        setNewEventLetterBackground(null);
        setNewEventLetterSize('A4');
        setNewEventLetterContent('');
        fetchEvents();"""
    content = content.replace(old_reset, new_reset)

    old_edit_open = """                          setNewEventLocation(event.location || "");
                          setNewEventLogo(event.logo || undefined);
                          setNewEventInvitationFile(event.invitationFile || null);
                          setEditingEventId(event.id);
                          setIsEditEventModalOpen(true);"""
    new_edit_open = """                          setNewEventLocation(event.location || "");
                          setNewEventLogo(event.logo || undefined);
                          setNewEventInvitationFile(event.invitationFile || null);
                          setNewEventLetterBackground(event.letterBackground || null);
                          setNewEventLetterSize((event.letterSize as any) || 'A4');
                          setNewEventLetterContent(event.letterContent || '');
                          setEditingEventId(event.id);
                          setIsEditEventModalOpen(true);"""
    content = content.replace(old_edit_open, new_edit_open)

    # Note: there is another reset for creating event
    old_create_reset = """        setNewEventLocation('');
        setNewEventLogo(undefined);
        fetchEvents();"""
    new_create_reset = """        setNewEventLocation('');
        setNewEventLogo(undefined);
        setNewEventLetterBackground(null);
        setNewEventLetterSize('A4');
        setNewEventLetterContent('');
        fetchEvents();"""
    content = content.replace(old_create_reset, new_create_reset)

    # Note: there is another setSelectedEvent edit in handleUpdateEvent
    old_selected_event = """location: newEventLocation, logo: newEventLogo, invitationFile: newEventInvitationFile });"""
    new_selected_event = """location: newEventLocation, logo: newEventLogo, invitationFile: newEventInvitationFile, letterBackground: newEventLetterBackground, letterSize: newEventLetterSize, letterContent: newEventLetterContent });"""
    content = content.replace(old_selected_event, new_selected_event)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
