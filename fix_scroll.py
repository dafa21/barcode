import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # 1. Fix sidebar height on mobile
    old_sidebar = 'className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col h-96 lg:h-[calc(100vh-12rem)] shadow-sm"'
    new_sidebar = 'className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px] lg:h-[calc(100vh-12rem)] shadow-sm"'
    content = content.replace(old_sidebar, new_sidebar)

    # 2. Fix Edit Event Modal max-height and scrolling
    old_edit_modal_wrap = 'className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>'
    new_edit_modal_wrap = 'className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>'
    content = content.replace(old_edit_modal_wrap, new_edit_modal_wrap)

    # We need to target the edit modal's header to add shrink-0, but we can also just let it be if it works.
    # The body is `<div className="p-6">` immediately following the header in Edit Modal.
    # Let's find:
    #             </div>
    #             <div className="p-6">
    #               <form onSubmit={handleUpdateEvent} className="space-y-4">
    old_edit_body = """            </div>
            <div className="p-6">
              <form onSubmit={handleUpdateEvent} className="space-y-4">"""
    new_edit_body = """            </div>
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleUpdateEvent} className="space-y-4">"""
    content = content.replace(old_edit_body, new_edit_body)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
