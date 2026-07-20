with open('src/components/OfficeAdminDashboard.tsx', 'r') as f:
    code = f.read()

events_start = code.find('<div className="flex flex-col gap-4 h-full">')
guests_start = code.find('{activeTab === \'guests\' && (')
print("events end:", code[guests_start-100:guests_start])
