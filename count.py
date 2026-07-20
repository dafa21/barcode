with open('office_admin_dashboard_copy.txt', 'r') as f:
    code = f.read()
start = code.find('<div className="col-span-12 lg:col-span-8 flex flex-col gap-6">')
end_marker = '                </div>\n              )}\n            </div>\n          </div>'
end = code.find(end_marker, start) + len(end_marker)
jsx = code[start:end]
print("open divs:", jsx.count('<div'))
print("close divs:", jsx.count('</div'))
