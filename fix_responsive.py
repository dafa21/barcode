import sys

def make_responsive(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Make the top event header responsive
    content = content.replace(
        '<div className="p-6 border-b border-gray-200 flex items-start justify-between bg-gray-50">',
        '<div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-start justify-between bg-gray-50 gap-4">'
    )
    content = content.replace(
        '<div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">',
        '<div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">'
    )
    content = content.replace(
        '<div className="flex items-center gap-2">\n                    <button',
        '<div className="flex flex-wrap items-center gap-2 w-full md:w-auto">\n                    <button'
    )
    
    # Make the "Access Log" row responsive
    content = content.replace(
        '<div className="flex items-center justify-between mb-4">\n                        <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500">Access Log',
        '<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">\n                        <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500">Access Log'
    )
    content = content.replace(
        '<div className="flex gap-3">\n                          <button',
        '<div className="flex flex-wrap items-center gap-3 w-full md:w-auto">\n                          <button'
    )
    content = content.replace(
        '<div className="relative">\n                            <Search',
        '<div className="relative w-full md:w-auto">\n                            <Search'
    )
    content = content.replace(
        'w-64"\n                            />',
        'w-full md:w-64"\n                            />'
    )
    
    # Check heights for mobile
    content = content.replace(
        'h-[calc(100vh-12rem)]',
        'h-96 lg:h-[calc(100vh-12rem)]'
    )

    with open(filepath, "w") as f:
        f.write(content)

make_responsive("src/components/OfficeAdminDashboard.tsx")

