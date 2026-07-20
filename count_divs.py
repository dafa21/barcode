with open('src/components/OfficeAdminDashboard.tsx', 'r') as f:
    code = f.read()

idx = code.find('        {activeTab === \'guests\' && (')
print("guests section:")
print(code[idx:idx+150])
