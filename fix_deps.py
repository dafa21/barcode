with open('src/components/OfficeAdminDashboard.tsx', 'r') as f:
    code = f.read()

code = code.replace('[selectedEvent?.id, searchTerm, statusFilter]', '[selectedEvent?.id, searchQuery, statusFilter]')

with open('src/components/OfficeAdminDashboard.tsx', 'w') as f:
    f.write(code)
