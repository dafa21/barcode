import re

with open('src/components/OfficeAdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add state variable
content = content.replace("const [newGuestIsVip, setNewGuestIsVip] = useState(false);",
                          "const [newGuestIsVip, setNewGuestIsVip] = useState(false);\n  const [newGuestCustomFile, setNewGuestCustomFile] = useState<string>('');")

# 2. Reset state
content = content.replace("setNewGuestIsVip(false);",
                          "setNewGuestIsVip(false);\n        setNewGuestCustomFile('');")

# 3. HandleAddGuest payload
content = content.replace("isVip: newGuestIsVip\n",
                          "isVip: newGuestIsVip,\n          customInvitationFile: newGuestCustomFile || undefined\n")

# 4. Single WhatsApp link
content = content.replace("const fileUrl = `${getBaseUrl()}/api/events/public/invitation/${selectedEvent?.eventName?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;",
                          "const fileUrl = guest.customInvitationFile ? `${getBaseUrl()}/api/guests/public/invitation/${guest.barcodeUid}` : `${getBaseUrl()}/api/events/public/invitation/${selectedEvent?.eventName?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;")

# 5. Add Guest Form input
vip_div = """                </div>
                <button type="submit" className="w-full py-3 bg-indigo-600"""
custom_file_div = """                </div>
                <div className="pt-2">
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">File Undangan Pribadi (PDF Khusus Tamu Ini - Opsional)</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setNewGuestCustomFile(reader.result as string);
                        reader.readAsDataURL(file);
                      } else {
                        setNewGuestCustomFile('');
                      }
                    }}
                    className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-indigo-600"""
content = content.replace(vip_div, custom_file_div)

# 6. Edit Guest Payload
content = content.replace("isVip: editingGuest.isVip\n",
                          "isVip: editingGuest.isVip,\n                      customInvitationFile: editingGuest.customInvitationFile || undefined\n")

# 7. Edit Guest Form input
edit_vip_div = """                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">"""
edit_custom_file_div = """                  </label>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">File Undangan Pribadi (PDF Khusus Tamu Ini - Opsional)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setEditingGuest({ ...editingGuest, customInvitationFile: reader.result as string });
                      reader.readAsDataURL(file);
                    } else {
                      setEditingGuest({ ...editingGuest, customInvitationFile: '' });
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">"""
content = content.replace(edit_vip_div, edit_custom_file_div)


with open('src/components/OfficeAdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done patching OfficeAdminDashboard.tsx")
