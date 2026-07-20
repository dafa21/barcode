with open('src/components/OfficeAdminDashboard.tsx', 'r') as f:
    code = f.read()

code = code.replace('      </div>\n    </div>\n</div>\n\n          {/* Pagination Controls */}', '      </div>\n    </div>\n  ))}\n</div>\n\n          {/* Pagination Controls */}')

with open('src/components/OfficeAdminDashboard.tsx', 'w') as f:
    f.write(code)
