const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'OfficeAdminDashboard.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add imports
if (!content.includes('import { CustomModal')) {
  content = content.replace(
    "import React, { useState, useEffect, useRef } from 'react';",
    "import React, { useState, useEffect, useRef } from 'react';\nimport { CustomModal } from './CustomModal.tsx';"
  );
}

// 2. Add state and helper functions at the beginning of the component
if (!content.includes('const [modalConfig')) {
  content = content.replace(
    "export function OfficeAdminDashboard({ user }: { user: User }) {",
    `export function OfficeAdminDashboard({ user }: { user: User }) {
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'alert' | 'confirm' | 'success';
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({ isOpen: false, type: 'alert', title: '', message: '' });

  const showAlert = (title: string, message: string, type: 'alert' | 'success' = 'alert') => {
    setModalConfig({ isOpen: true, type, title, message });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setModalConfig({ isOpen: true, type: 'confirm', title, message, onConfirm });
  };`
  );
}

// 3. Add <CustomModal /> at the end of the return statement
if (!content.includes('<CustomModal config=')) {
  content = content.replace(
    /<\/div>\s*$/i,
    `  <CustomModal config={modalConfig} onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} />
    </div>`
  );
}

// 4. Replace alert(...) with showAlert('Pemberitahuan', ...)
content = content.replace(/alert\('([^']+)'\)/g, "showAlert('Pemberitahuan', '$1')");
content = content.replace(/alert\("([^"]+)"\)/g, "showAlert('Pemberitahuan', \"$1\")");
content = content.replace(/alert\(`([^`]+)`\)/g, "showAlert('Pemberitahuan', `$1`)");
// Handle expressions in alert like alert(error.error || '...')
content = content.replace(/alert\((.*?)\);/g, "showAlert('Pemberitahuan', String($1));");

// 5. Replace confirm manually
const deleteEventCode = `  const handleDeleteEvent = async (id: string) => {
    showConfirm("Hapus Acara", "Apakah Anda yakin ingin menghapus acara ini? Semua tamu dan absensi akan ikut terhapus.", async () => {
      try {
        const res = await fetch(\`/api/events/\${id}\`, {
          method: "DELETE",
          headers: { Authorization: \`Bearer \${localStorage.getItem("token")}\` }
        });
        if (res.ok) {
          fetchEvents();
          if (selectedEvent?.id === id) {
            setSelectedEvent(null);
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
  };`;

const deleteGuestCode = `  const handleDeleteGuest = async (id: string) => {
    showConfirm("Hapus Tamu", "Apakah Anda yakin ingin menghapus tamu ini?", async () => {
      try {
        const res = await fetch(\`/api/guests/\${id}\`, {
          method: "DELETE",
          headers: { Authorization: \`Bearer \${localStorage.getItem("token")}\` }
        });
        if (res.ok) {
          if (selectedEvent) {
            fetchGuests(selectedEvent.id);
          }
        } else {
          showAlert("Pemberitahuan", "Gagal menghapus tamu");
        }
      } catch (error) {
        console.error(error);
        showAlert("Pemberitahuan", "Terjadi kesalahan");
      }
    });
  };`;

content = content.replace(/const handleDeleteEvent = async \([^)]+\) => {[\s\S]*?};\s*/m, deleteEventCode + "\n\n");
content = content.replace(/const handleDeleteGuest = async \([^)]+\) => {[\s\S]*?};\s*/m, deleteGuestCode + "\n\n");

// Fix success messages
content = content.replace(/showAlert\('Pemberitahuan', String\('Data tamu berhasil diperbarui!'\)\)/g, "showAlert('Berhasil', 'Data tamu berhasil diperbarui!', 'success')");
content = content.replace(/showAlert\('Pemberitahuan', String\(\`\$\{newGuests.length\} tamu berhasil ditambahkan.\`\)\)/g, "showAlert('Berhasil', \`\${newGuests.length} tamu berhasil ditambahkan.\`, 'success')");


fs.writeFileSync(file, content);
console.log('Patch complete.');
