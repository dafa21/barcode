with open('office_admin_dashboard_copy.txt', 'r') as f:
    code = f.read()

events_start = code.find('<div className="col-span-12 lg:col-span-4')
events_end = code.find('<div className="col-span-12 lg:col-span-8')
guests_start = events_end
guests_end = code.find('      )}\n    </div>')

print("events_start:", events_start)
print("events_end:", events_end)
print("guests_start:", guests_start)
print("guests_end:", guests_end)
if guests_end != -1:
    print(code[guests_end:guests_end+20])
