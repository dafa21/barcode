with open('office_admin_dashboard_copy.txt', 'r') as f:
    code = f.read()

old_return_start = code.find('  return (\n    <>\n    <div className="flex flex-col gap-6 h-full">')
old_return_end = code.find('      </div>\n    \n      {isEditEventModalOpen && (')

print("old_return_start:", old_return_start)
print("old_return_end:", old_return_end)
