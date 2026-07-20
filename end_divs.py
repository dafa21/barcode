with open('src/components/OfficeAdminDashboard.tsx', 'r') as f:
    code = f.read()

idx = code.find('Select an event to view details and manage access.')
print(code[idx:idx+250])
