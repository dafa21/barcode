import sys
import re

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Find the handleUpdateEvent try-catch
    old_update = """      if (res.ok) {
        setIsEditEventModalOpen(false);
        setEditingEventId(null);
        setNewEventName("");
        setNewEventDate("");
        setNewEventLocation("");
        setNewEventLogo(undefined);
        setNewEventInvitationFile(null);
        fetchEvents();
        if (selectedEvent?.id === editingEventId) {
          setSelectedEvent({ ...selectedEvent, eventName: newEventName, eventDate: new Date(newEventDate), location: newEventLocation, logo: newEventLogo, invitationFile: newEventInvitationFile });
        }
      }
    } catch (error) {
      console.error(error);
    }"""
    new_update = """      if (res.ok) {
        setIsEditEventModalOpen(false);
        setEditingEventId(null);
        setNewEventName("");
        setNewEventDate("");
        setNewEventLocation("");
        setNewEventLogo(undefined);
        setNewEventInvitationFile(null);
        fetchEvents();
        if (selectedEvent?.id === editingEventId) {
          setSelectedEvent({ ...selectedEvent, eventName: newEventName, eventDate: new Date(newEventDate), location: newEventLocation, logo: newEventLogo, invitationFile: newEventInvitationFile });
        }
      } else {
        alert("Gagal memperbarui acara. File mungkin terlalu besar.");
      }
    } catch (error) {
      console.error(error);
      alert("Error: " + (error instanceof Error ? error.message : "Gagal menghubungi server."));
    }"""
    content = content.replace(old_update, new_update)

    old_create = """      if (res.ok) {
        setShowNewEvent(false);
        setNewEventName('');
        setNewEventDate('');
        setNewEventLocation('');
        setNewEventLogo(undefined);
        fetchEvents();
      }
    } catch (error) {
      console.error(error);
    }"""
    new_create = """      if (res.ok) {
        setShowNewEvent(false);
        setNewEventName('');
        setNewEventDate('');
        setNewEventLocation('');
        setNewEventLogo(undefined);
        fetchEvents();
      } else {
        alert("Gagal membuat acara. File mungkin terlalu besar.");
      }
    } catch (error) {
      console.error(error);
      alert("Error: " + (error instanceof Error ? error.message : "Gagal menghubungi server."));
    }"""
    content = content.replace(old_create, new_create)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
