with open('src/components/OfficeAdminDashboard.tsx', 'r') as f:
    code = f.read()

code = code.replace('handleGenerateBarcode(guest.barcodeUid, guest.guestName)', 'handlePrintBarcode(guest.barcodeUid, guest.guestName)')
code = code.replace('<button onClick={() => handleDeleteGuest(guest.id)} className="inline-flex items-center justify-center p-1.5 bg-gray-50 text-gray-600 rounded border border-gray-200 hover:bg-white hover:text-red-600 transition-colors ml-auto" title="Delete Guest">\n            <Trash2 className="w-3.5 h-3.5" />\n         </button>', '')

with open('src/components/OfficeAdminDashboard.tsx', 'w') as f:
    f.write(code)
print("Methods fixed")
