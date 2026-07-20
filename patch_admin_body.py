import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Edit event body
    old_update_body = """          location: newEventLocation, logo: newEventLogo 
        })"""
    new_update_body = """          location: newEventLocation, 
          logo: newEventLogo,
          invitationFile: newEventInvitationFile
        })"""
    content = content.replace(old_update_body, new_update_body)

    # Edit event success state
    old_selected_event = """          setSelectedEvent({ ...selectedEvent, eventName: newEventName, eventDate: new Date(newEventDate), location: newEventLocation, logo: newEventLogo });"""
    new_selected_event = """          setSelectedEvent({ ...selectedEvent, eventName: newEventName, eventDate: new Date(newEventDate), location: newEventLocation, logo: newEventLogo, invitationFile: newEventInvitationFile });"""
    content = content.replace(old_selected_event, new_selected_event)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
