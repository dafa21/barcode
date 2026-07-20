import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_func = """  const fetchGuests = async (eventId: string) => {
    try {
      const res = await fetch(`/api/guests/event/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setGuests(await res.json());
      }
    } catch (error) {
      console.error(error);
    }
  };"""

    new_func = """  const fetchGuests = async (eventId: string) => {
    try {
      const res = await fetch(`/api/guests/event/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setGuests(await res.json());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleManualCheckIn = async (barcodeUid: string) => {
    if (!selectedEvent) return;
    try {
      const res = await fetch('/api/scanner/scan', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ barcodeUid, eventId: selectedEvent.id })
      });
      if (res.ok) {
        fetchGuests(selectedEvent.id);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to check in manually');
      }
    } catch (err) {
      console.error(err);
      alert('Network error during manual check-in');
    }
  };"""

    content = content.replace(old_func, new_func)

    old_ui = """                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {guest.status === 'attended' ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
                                      Attended
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                                      Pending
                                    </span>
                                  )}
                                </td>"""

    new_ui = """                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {guest.status === 'attended' ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
                                      Attended
                                    </span>
                                  ) : (
                                    <button 
                                      onClick={() => handleManualCheckIn(guest.barcodeUid)}
                                      className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer shadow-sm"
                                    >
                                      Check In
                                    </button>
                                  )}
                                </td>"""

    content = content.replace(old_ui, new_ui)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
