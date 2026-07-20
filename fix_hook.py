with open('src/components/OfficeAdminDashboard.tsx', 'r') as f:
    code = f.read()

hook_str = """
  // Reset page when event changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedEvent?.id, searchQuery, statusFilter]);
"""

code = code.replace(hook_str, "")
code = code.replace("  if (loading) return <div>Loading events...</div>;", hook_str + "\n  if (loading) return <div>Loading events...</div>;")

with open('src/components/OfficeAdminDashboard.tsx', 'w') as f:
    f.write(code)
