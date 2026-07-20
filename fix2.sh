sed -i '249,294c\
  const toggleSelectGuest = (id: string) => {\
    setSelectedGuestIds(prev => \
      prev.includes(id) ? prev.filter(gId => gId !== id) : [...prev, id]\
    );\
  };\
\
  const handleExportToExcel = () => {\
    if (!selectedEvent || guests.length === 0) return;\
    const exportData = guests.map((guest, index) => ({\
      No: index + 1,\
      Name: guest.guestName,\
      Company: guest.company || "-",\
      JobTitle: guest.jobTitle || "-",\
      Email: guest.email || "-",\
      Phone: guest.phone || "-",\
      "Barcode UID": guest.barcodeUid,\
      Status: guest.status === "attended" ? "Attended" : "Pending",\
      "Scanned At": guest.scannedAt ? new Date(guest.scannedAt).toLocaleString() : "-",\
    }));\
    const worksheet = XLSX.utils.json_to_sheet(exportData);\
    const workbook = XLSX.utils.book_new();\
    XLSX.utils.book_append_sheet(workbook, worksheet, "Guests");\
    XLSX.writeFile(workbook, `${selectedEvent.eventName}_Guests.xlsx`);\
  };' src/components/OfficeAdminDashboard.tsx
