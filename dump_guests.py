with open('src/components/OfficeAdminDashboard.tsx', 'r') as f:
    code = f.read()

start = code.find("{activeTab === 'guests'")
end = code.find("{isEditEventModalOpen && (")
print(code[start:end])
