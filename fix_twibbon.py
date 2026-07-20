with open("src/components/OfficeAdminDashboard.tsx", "r") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "</>" in line and "  );" in lines[i+1]:
        lines.insert(i, "      {isTwibbonConfigOpen && selectedEvent && (\n        <TwibbonConfigurator\n          event={selectedEvent}\n          onClose={() => setIsTwibbonConfigOpen(false)}\n          onSave={handleSaveTwibbonConfig}\n        />\n      )}\n")
        break

with open("src/components/OfficeAdminDashboard.tsx", "w") as f:
    f.writelines(lines)
