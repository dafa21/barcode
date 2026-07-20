with open('office_admin_dashboard_copy.txt', 'r') as f:
    code = f.read()
events_start = code.find('<div className="col-span-12 lg:col-span-4 flex flex-col gap-4">')
guests_start = code.find('<div className="col-span-12 lg:col-span-8 flex flex-col gap-6">')
print(code[guests_start-100:guests_start])
