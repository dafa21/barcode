import sys
import re

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Add state
    old_state = r"const \[newGuestPicId, setNewGuestPicId\] = useState\(''\);"
    new_state = r"const [newGuestPicId, setNewGuestPicId] = useState('');\n  const [newGuestIsVip, setNewGuestIsVip] = useState(false);"
    content = re.sub(old_state, new_state, content)

    # Add to payload
    old_payload = r"picId: newGuestPicId \|\| undefined"
    new_payload = r"picId: newGuestPicId || undefined,\n          isVip: newGuestIsVip"
    content = re.sub(old_payload, new_payload, content)

    # Reset state
    old_reset = r"setNewGuestPicId\(''\);"
    new_reset = r"setNewGuestPicId('');\n        setNewGuestIsVip(false);"
    content = re.sub(old_reset, new_reset, content)

    # Add Checkbox to form
    old_form = r"placeholder=\"e\.g\. \+628123456789\"\n                    className=\"w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 py-2\.5 px-3\"\n                  />\n                </div>\n                <button"
    new_form = r"""placeholder="e.g. +628123456789"
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 py-2.5 px-3"
                  />
                </div>
                <div className="flex items-center gap-2 mt-4 bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <input
                    type="checkbox"
                    id="isVip"
                    checked={newGuestIsVip}
                    onChange={e => setNewGuestIsVip(e.target.checked)}
                    className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="isVip" className="text-sm font-medium text-amber-900 cursor-pointer select-none">
                    Tandai sebagai Tamu VIP
                  </label>
                </div>
                <button"""
    content = re.sub(old_form, new_form, content)

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/OfficeAdminDashboard.tsx")
