with open('src/components/OfficeAdminDashboard.tsx', 'r') as f:
    code = f.read()

code = code.replace("          )}                    )}      </div>    </div>", "          )}      </div>    </div>")

with open('src/components/OfficeAdminDashboard.tsx', 'w') as f:
    f.write(code)
