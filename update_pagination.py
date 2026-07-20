with open('office_admin_dashboard_copy3.txt', 'r') as f:
    code = f.read()

code = code.replace("const itemsPerPage = 12;", "const [itemsPerPage, setItemsPerPage] = useState(12);\n  const [selectedGuestDetail, setSelectedGuestDetail] = useState<Guest | null>(null);")

with open('office_admin_dashboard_copy3.txt', 'w') as f:
    f.write(code)
