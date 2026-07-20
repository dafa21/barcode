import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old1 = """<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-600 border border-red-200">Tidak Hadir</span>"""
    new1 = """<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-600 border border-red-200 w-fit">Tidak Hadir</span>"""
    content = content.replace(old1, new1)

    old2 = """<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">Menunggu</span>"""
    new2 = """<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200 w-fit">Menunggu</span>"""
    content = content.replace(old2, new2)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
