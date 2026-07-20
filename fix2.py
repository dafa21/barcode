with open('office_admin_dashboard_copy.txt', 'r') as f:
    code = f.read()

# Instead of code[old_return_end:], we will use code[old_return_end + len('      </div>\n    \n'):]
old_return_end = code.find('      </div>\n    \n      {isEditEventModalOpen && (')
after_return = code[old_return_end + len('      </div>\n    \n'):]

# Let's write the whole file properly.
# (Running the whole rewrite again with this fix)
import re

events_start = code.find('<div className="col-span-12 lg:col-span-4 flex flex-col gap-4">')
guests_start = code.find('<div className="col-span-12 lg:col-span-8 flex flex-col gap-6">')
guests_end_marker = '                </div>\n              )}\n            </div>'
guests_end = code.find(guests_end_marker, guests_start) + len(guests_end_marker)

events_jsx = code[events_start:guests_start]
guests_jsx = code[guests_start:guests_end]

events_jsx = events_jsx.replace('<div className="col-span-12 lg:col-span-4 flex flex-col gap-4">', '<div className="flex flex-col gap-4 h-full">')
events_jsx = events_jsx.replace('lg:h-[calc(100vh-12rem)]', 'h-full')
guests_jsx = guests_jsx.replace('<div className="col-span-12 lg:col-span-8 flex flex-col gap-6">', '<div className="flex flex-col gap-6 h-full">')

table_start = guests_jsx.find('<table className="min-w-full divide-y divide-gray-200">')
table_end = guests_jsx.find('</table>') + len('</table>')
table_jsx = guests_jsx[table_start:table_end]

with open('cards.txt', 'r') as f:
    cards_jsx = f.read()

guests_jsx = guests_jsx.replace(table_jsx, cards_jsx)

new_return = f"""  return (
    <>
    <div className="flex flex-col md:flex-row h-full min-h-[calc(100vh-5rem)] bg-white">
      {{/* Sidebar */}}
      <div className="w-full md:w-64 shrink-0 border-r border-gray-200 p-4 flex flex-col gap-2 bg-gray-50 overflow-y-auto">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-3">Main Menu</h3>
        <button
          onClick={{() => setActiveTab('events')}}
          className={{`px-4 py-3 text-left text-sm font-semibold uppercase tracking-widest rounded-xl transition-colors ${{
            activeTab === 'events' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
          }}`}}
        >
          <div className="flex items-center gap-3">
             <Calendar className="w-4 h-4" />
             Event Management
          </div>
        </button>
        <button
          onClick={{() => setActiveTab('guests')}}
          className={{`px-4 py-3 text-left text-sm font-semibold uppercase tracking-widest rounded-xl transition-colors ${{
            activeTab === 'guests' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
          }}`}}
        >
          <div className="flex items-center gap-3">
             <Users className="w-4 h-4" />
             Daftar Tamu
          </div>
        </button>
        <button
          onClick={{() => setActiveTab('analytics')}}
          className={{`px-4 py-3 text-left text-sm font-semibold uppercase tracking-widest rounded-xl transition-colors ${{
            activeTab === 'analytics' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
          }}`}}
        >
          <div className="flex items-center gap-3">
             <Activity className="w-4 h-4" />
             Analytics
          </div>
        </button>
      </div>

      {{/* Main Content */}}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col min-w-0 bg-gray-50/50">
        {{activeTab === 'analytics' && <AnalyticsDashboard />}}
        {{activeTab === 'events' && (
{events_jsx}
        )}}
        {{activeTab === 'guests' && (
{guests_jsx}
        )}}
      </div>
    </div>
    
"""

old_return_start = code.find('  return (\n    <>\n    <div className="flex flex-col gap-6 h-full">')

new_code = code[:old_return_start] + new_return + after_return
new_code = new_code.replace("useState<'events' | 'analytics' | 'pics'>('events')", "useState<'events' | 'guests' | 'analytics' | 'pics'>('events')")
new_code = new_code.replace("activeTab === 'dashboard'", "activeTab === 'analytics'")
new_code = new_code.replace("setActiveTab('dashboard')", "setActiveTab('analytics')")

with open('src/components/OfficeAdminDashboard.tsx', 'w') as f:
    f.write(new_code)
print("Done")
