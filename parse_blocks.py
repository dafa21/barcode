with open('src/components/OfficeAdminDashboard.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines[1535:1560]):
    print(f"{1536+i}: {line.rstrip()}")
