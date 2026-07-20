import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_modal_container = """        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsRegisterModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">"""

    new_modal_container = """        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsRegisterModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">"""
            
    content = content.replace(old_modal_container, new_modal_container)

    old_modal_body = """              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddGuest} className="space-y-4">"""

    new_modal_body = """              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleAddGuest} className="space-y-4">"""

    content = content.replace(old_modal_body, new_modal_body)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
