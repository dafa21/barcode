import sys
import re

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Background of min-h-screen
    old_bg = r'className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col"'
    new_bg = r'className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900 font-sans flex flex-col"'
    content = re.sub(old_bg, new_bg, content)

    # Header
    old_header = r'className="h-20 border-b border-gray-200 px-4 md:px-8 flex items-center justify-between bg-white"'
    new_header = r'className="h-20 border-b border-indigo-100/50 px-4 md:px-8 flex items-center justify-between bg-white/60 backdrop-blur-md sticky top-0 z-50"'
    content = re.sub(old_header, new_header, content)

    # Grid background
    old_grid = r'bg-\[linear-gradient\(to_right,#00000005_1px,transparent_1px\),linear-gradient\(to_bottom,#00000005_1px,transparent_1px\)\]'
    new_grid = r'bg-[linear-gradient(to_right,#6366f115_1px,transparent_1px),linear-gradient(to_bottom,#6366f115_1px,transparent_1px)]'
    content = re.sub(old_grid, new_grid, content)

    # Add floating blobs
    old_main = r'<main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">'
    new_main = r"""<main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Colorful floating blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[20%] w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>"""
    content = re.sub(old_main, new_main, content)

    # Camera box
    old_camera = r'className="w-full aspect-\[3/4\] max-w-sm mx-auto overflow-hidden rounded-3xl border-4 border-white/50 bg-black/5 shadow-2xl relative backdrop-blur-sm"'
    new_camera = r'className="w-full aspect-[3/4] max-w-sm mx-auto overflow-hidden rounded-3xl border-4 border-white/60 bg-white/20 shadow-[0_8px_32px_rgba(99,102,241,0.2)] relative backdrop-blur-md"'
    content = re.sub(old_camera, new_camera, content)

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/Scanner.tsx")
