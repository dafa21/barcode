import re

with open('src/components/OfficeAdminDashboard.tsx', 'r') as f:
    content = f.read()

# Find the start of the return statement
start_idx = content.find('  return (\n    <>\n    <div className="flex flex-col gap-6 h-full">')
if start_idx != -1:
    print(content[start_idx:start_idx+1000])
