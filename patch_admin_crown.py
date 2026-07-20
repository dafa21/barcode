import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    content = content.replace("LayoutList, Activity, Download, MessageCircle, X, UserPlus, Printer } from 'lucide-react';", "LayoutList, Activity, Download, MessageCircle, X, UserPlus, Printer, Crown } from 'lucide-react';")

    old_guest_name_td = '<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{guest.guestName}</td>'
    new_guest_name_td = '<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2">{guest.guestName}{guest.isVip && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200"><Crown className="w-3 h-3"/> VIP</span>}</td>'
    
    content = content.replace(old_guest_name_td, new_guest_name_td)

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/OfficeAdminDashboard.tsx")
