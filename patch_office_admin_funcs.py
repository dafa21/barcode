import sys
import re

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Import useRef
    content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect, useRef } from 'react';")

    # Add fileInputRef
    old_state = "const [searchQuery, setSearchQuery] = useState('');"
    new_state = "const [searchQuery, setSearchQuery] = useState('');\n  const fileInputRef = useRef<HTMLInputElement>(null);"
    content = content.replace(old_state, new_state)

    # Add handler functions
    old_export = "  const handleExportToExcel = async () => {"
    new_funcs = """  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedEvent) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const XLSX = await import('xlsx');
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        const newGuests = data.map((row: any) => ({
          eventId: selectedEvent.id,
          guestName: row['Nama Tamu'] || row['Name'] || row['Guest Name'] || '',
          email: row['Email'] || null,
          phone: row['Telepon'] || row['Phone'] || null,
          company: row['Instansi'] || row['Company'] || null,
          jobTitle: row['Jabatan'] || row['Job Title'] || null,
          isVip: (row['VIP'] || '').toString().toLowerCase() === 'ya' || (row['VIP'] || '').toString().toLowerCase() === 'yes',
        })).filter(g => g.guestName);

        if (newGuests.length === 0) {
          alert('Tidak ada data tamu yang valid ditemukan. Pastikan format kolom sesuai dengan template.');
          return;
        }

        const res = await fetch('/api/guests/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ guests: newGuests })
        });

        if (res.ok) {
          fetchGuests(selectedEvent.id);
          alert(`${newGuests.length} tamu berhasil ditambahkan.`);
        } else {
          const err = await res.json();
          alert(`Gagal mengupload: ${err.error}`);
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Gagal memproses file Excel.');
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadTemplate = async () => {
    const XLSX = await import('xlsx');
    const ws = XLSX.utils.json_to_sheet([
      { 'Nama Tamu': 'John Doe', 'Email': 'john@example.com', 'Telepon': '08123456789', 'Instansi': 'PT Contoh', 'Jabatan': 'Direktur', 'VIP': 'Ya' },
      { 'Nama Tamu': 'Jane Smith', 'Email': '', 'Telepon': '', 'Instansi': '', 'Jabatan': '', 'VIP': 'Tidak' },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Tamu");
    XLSX.writeFile(wb, "Template_Tamu_Undangan.xlsx");
  };

  const handleExportToExcel = async () => {"""
    content = content.replace(old_export, new_funcs)

    # Add UI buttons
    old_ui = """                            <Download className="w-4 h-4" />
                            Export to XLSX
                          </button>"""
    new_ui = """                            <Download className="w-4 h-4" />
                            Export to XLSX
                          </button>
                          
                          <div className="flex items-center gap-2 border-l border-gray-200 pl-3 ml-1">
                            <input
                              type="file"
                              accept=".xlsx, .xls"
                              className="hidden"
                              ref={fileInputRef}
                              onChange={handleFileUpload}
                            />
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors shadow-sm"
                            >
                              <Upload className="w-4 h-4" />
                              Upload XLSX
                            </button>
                            <button
                              onClick={handleDownloadTemplate}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium rounded-lg hover:bg-amber-100 transition-colors shadow-sm"
                              title="Download Excel Template"
                            >
                              <FileText className="w-4 h-4" />
                              Template
                            </button>
                          </div>"""
    content = content.replace(old_ui, new_ui)

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/OfficeAdminDashboard.tsx")
