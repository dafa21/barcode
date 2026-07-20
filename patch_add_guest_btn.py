import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_ui = """                          <button
                            onClick={handleExportToExcel}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                          >
                            <Download className="w-4 h-4" />
                            Export to XLSX
                          </button>"""
    
    new_ui = """                          <button
                            onClick={() => setIsRegisterModalOpen(true)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-medium rounded-lg hover:bg-indigo-100 transition-colors shadow-sm"
                          >
                            <UserPlus className="w-4 h-4" />
                            Add Guest
                          </button>
                          <button
                            onClick={handleExportToExcel}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                          >
                            <Download className="w-4 h-4" />
                            Export to XLSX
                          </button>"""
    content = content.replace(old_ui, new_ui)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
