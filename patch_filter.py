import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Add state
    old_state = "  const [searchQuery, setSearchQuery] = useState('');"
    new_state = "  const [searchQuery, setSearchQuery] = useState('');\n  const [statusFilter, setStatusFilter] = useState<'all' | 'attending' | 'pending' | 'not_attending' | 'checked_in'>('all');"
    content = content.replace(old_state, new_state)

    # Filter logic
    old_filter = """  const filteredGuests = guests.filter(guest => 
    guest.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    guest.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.barcodeUid.toLowerCase().includes(searchQuery.toLowerCase())
  );"""
    
    new_filter = """  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          guest.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          guest.barcodeUid.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'checked_in') return guest.status === 'attended';
    if (statusFilter === 'attending') return guest.rsvpStatus === 'attending' && guest.status !== 'attended';
    if (statusFilter === 'not_attending') return guest.rsvpStatus === 'not_attending';
    if (statusFilter === 'pending') return guest.rsvpStatus === 'pending' && guest.status !== 'attended';
    return true;
  });"""
    content = content.replace(old_filter, new_filter)

    # UI Dropdown
    old_ui = """                          {selectedGuestIds.length > 0 && (
                            <button
                              onClick={handleBulkSendInvitations}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-medium rounded-lg hover:bg-emerald-100 transition-colors shadow-sm"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Send {selectedGuestIds.length} Invitations
                            </button>
                          )}
                          <div className="relative w-full md:w-auto">"""
    
    new_ui = """                          {selectedGuestIds.length > 0 && (
                            <button
                              onClick={handleBulkSendInvitations}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-medium rounded-lg hover:bg-emerald-100 transition-colors shadow-sm"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Send {selectedGuestIds.length} Invitations
                            </button>
                          )}
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 shadow-sm outline-none"
                          >
                            <option value="all">All Status</option>
                            <option value="attending">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="not_attending">Not Attending</option>
                            <option value="checked_in">Checked In</option>
                          </select>
                          <div className="relative w-full md:w-auto">"""
    content = content.replace(old_ui, new_ui)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
