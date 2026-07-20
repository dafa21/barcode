import sys
import re

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    new_ui = """                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Primary Color</label>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="color" 
                                    value={newEventThemePrimary} 
                                    onChange={(e) => setNewEventThemePrimary(e.target.value)} 
                                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                  />
                                  <input 
                                    type="text" 
                                    value={newEventThemePrimary} 
                                    onChange={(e) => setNewEventThemePrimary(e.target.value)} 
                                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Secondary Color</label>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="color" 
                                    value={newEventThemeSecondary} 
                                    onChange={(e) => setNewEventThemeSecondary(e.target.value)} 
                                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                  />
                                  <input 
                                    type="text" 
                                    value={newEventThemeSecondary} 
                                    onChange={(e) => setNewEventThemeSecondary(e.target.value)} 
                                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                  />
                                </div>
                              </div>
                            </div>
"""

    search_str1 = """                            <div>
                              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Isi Undangan Digital"""

    if search_str1 in content:
        content = content.replace(search_str1, new_ui + search_str1)
    else:
        print("search_str1 not found")

    new_ui2 = """                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Primary Color</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={newEventThemePrimary} 
                            onChange={(e) => setNewEventThemePrimary(e.target.value)} 
                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                          />
                          <input 
                            type="text" 
                            value={newEventThemePrimary} 
                            onChange={(e) => setNewEventThemePrimary(e.target.value)} 
                            className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Secondary Color</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={newEventThemeSecondary} 
                            onChange={(e) => setNewEventThemeSecondary(e.target.value)} 
                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                          />
                          <input 
                            type="text" 
                            value={newEventThemeSecondary} 
                            onChange={(e) => setNewEventThemeSecondary(e.target.value)} 
                            className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>
"""

    search_str2 = """                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Isi Undangan Digital"""

    if search_str2 in content:
        content = content.replace(search_str2, new_ui2 + search_str2)
    else:
        print("search_str2 not found")


    with open(filepath, "w") as f:
        f.write(content)
    print("UI Patched")

patch("src/components/OfficeAdminDashboard.tsx")
