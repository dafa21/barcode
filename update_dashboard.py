import re

with open('office_admin_dashboard_copy2.txt', 'r') as f:
    code = f.read()

# 1. Add pagination states
state_injection = """  const [activeTab, setActiveTab] = useState<'events' | 'guests' | 'analytics' | 'pics'>('events');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
"""
code = code.replace("  const [activeTab, setActiveTab] = useState<'events' | 'guests' | 'analytics' | 'pics'>('events');", state_injection)

# Make sure we reset currentPage when changing filters or selectedEvent
# Actually we can just derive paginatedGuests and add the pagination UI.
code = code.replace("const filteredGuests = guests.filter(guest => {", 
"""const filteredGuests = guests.filter(guest => {""")

paginated_logic = """
  // Pagination
  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);
  const paginatedGuests = filteredGuests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when event changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedEvent?.id, searchTerm, statusFilter]);
"""

# Let's insert paginated_logic before the return statement.
return_idx = code.rfind('  return (')
code = code[:return_idx] + paginated_logic + '\n' + code[return_idx:]

# Update the map function in guests tab
code = code.replace('{filteredGuests.map(guest => (', '{paginatedGuests.map(guest => (')

# Add pagination controls below the cards grid
pagination_ui = """</div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm mt-2">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-gray-700">
                    Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, filteredGuests.length)}</span> of{' '}
                    <span className="font-bold">{filteredGuests.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {/* Simplified page numbers, just show current and total */}
                    <span className="relative inline-flex items-center px-4 py-2 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}"""

code = code.replace("  ))}\n</div>", pagination_ui)

# Update layout to be compact and fix mobile sidebar
# Previous sidebar: <div className="w-full md:w-64 shrink-0 border-r border-gray-200 p-4 flex flex-col gap-2 bg-gray-50 overflow-y-auto">
# Let's change it to a horizontal scrollable menu on mobile, or real sidebar on desktop.
compact_sidebar = """<div className="w-full md:w-56 shrink-0 md:border-r border-b md:border-b-0 border-gray-200 p-3 flex md:flex-col gap-1 md:gap-2 bg-gray-50 overflow-x-auto md:overflow-y-auto overflow-y-hidden">
        <h3 className="hidden md:block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1 px-3">Menu</h3>"""
code = code.replace('<div className="w-full md:w-64 shrink-0 border-r border-gray-200 p-4 flex flex-col gap-2 bg-gray-50 overflow-y-auto">\n        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-3">Main Menu</h3>', compact_sidebar)

# Compact buttons
code = code.replace('px-4 py-3 text-left text-sm font-semibold', 'px-3 py-2 shrink-0 md:w-full text-left text-xs font-semibold')
# Reduce paddings in main content
code = code.replace('<div className="flex-1 p-6 overflow-y-auto', '<div className="flex-1 p-3 md:p-4 overflow-y-auto')
# Reduce gap in cards grid
code = code.replace('gap-4">', 'gap-3">')
# Reduce padding in event cards
code = code.replace('p-6 shadow-sm flex flex-col', 'p-4 shadow-sm flex flex-col')
code = code.replace('mb-6">', 'mb-4">')
# Event header sizes
code = code.replace('text-2xl font-bold', 'text-xl font-bold')
code = code.replace('text-3xl font-bold', 'text-2xl font-bold')

with open('src/components/OfficeAdminDashboard.tsx', 'w') as f:
    f.write(code)

print("done")
