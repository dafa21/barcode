import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Find handleSelectEvent
    old_logic = """  const handleSelectEvent = (event: typeof events.$inferSelect) => {
    setSelectedEvent(event);
    setNewEventName(event.eventName);
    setNewEventDate(new Date(event.eventDate).toISOString().slice(0, 16));
    setNewEventLogo(event.logo || undefined);
    setNewEventInvitationFile(event.invitationFile || null);
    setNewEventLetterBackground(event.letterBackground || null);
    setNewEventLetterSize(event.letterSize as 'A4' | 'LETTER' || 'A4');
    setNewEventLetterContent(event.letterContent || '');
    setNewEventHeroImage(event.heroImage || null);
    setNewEventBacksound(event.backsound || null);
    try { setNewEventGallery(event.gallery ? JSON.parse(event.gallery) : []); } catch(e) { setNewEventGallery([]); }
    setNewEventLocation(event.location || '');
  };"""

    new_logic = """  const handleSelectEvent = async (event: typeof events.$inferSelect) => {
    setSelectedEvent(event);
    
    // Fetch full details
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const fullEvent = await res.json();
        setNewEventName(fullEvent.eventName);
        setNewEventDate(new Date(fullEvent.eventDate).toISOString().slice(0, 16));
        setNewEventLogo(fullEvent.logo || undefined);
        setNewEventInvitationFile(fullEvent.invitationFile || null);
        setNewEventLetterBackground(fullEvent.letterBackground || null);
        setNewEventLetterSize(fullEvent.letterSize as 'A4' | 'LETTER' || 'A4');
        setNewEventLetterContent(fullEvent.letterContent || '');
        setNewEventHeroImage(fullEvent.heroImage || null);
        setNewEventBacksound(fullEvent.backsound || null);
        try { setNewEventGallery(fullEvent.gallery ? JSON.parse(fullEvent.gallery) : []); } catch(e) { setNewEventGallery([]); }
        setNewEventLocation(fullEvent.location || '');
        
        // Also update the selectedEvent with full details so preview works
        setSelectedEvent(fullEvent);
      }
    } catch (err) {
      console.error(err);
    }
  };"""

    content = content.replace(old_logic, new_logic)

    with open(filepath, "w") as f:
        f.write(content)

patch("src/components/OfficeAdminDashboard.tsx")
