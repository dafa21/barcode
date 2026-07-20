with open('office_admin_dashboard_copy.txt', 'r') as f:
    code = f.read()

table_start = code.find('<table className="min-w-full divide-y divide-gray-200">')
table_end = code.find('</table>') + len('</table>')
print(code[table_start:table_end])
