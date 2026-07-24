const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'SuperAdminDashboard.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add imports
if (!content.includes('import { CustomModal')) {
  content = content.replace(
    "import React, { useState, useEffect } from 'react';",
    "import React, { useState, useEffect } from 'react';\nimport { CustomModal } from './CustomModal.tsx';"
  );
}

// 2. Add state and helper functions
if (!content.includes('const [modalConfig')) {
  content = content.replace(
    "export function SuperAdminDashboard({ user }: { user: User }) {",
    `export function SuperAdminDashboard({ user }: { user: User }) {
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
  };`
  );
}

// 3. Add <CustomModal />
if (!content.includes('<CustomModal config=')) {
  content = content.replace(
    /<\/div>\s*$/i,
    `  <CustomModal config={modalConfig} onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} />
    </div>`
  );
}

// 4. Replace alerts
content = content.replace(/alert\('Admin created successfully'\)/g, "showAlert('Berhasil', 'Admin created successfully', 'success')");
content = content.replace(/alert\((.*?)\);/g, "showAlert('Pemberitahuan', String($1));");

fs.writeFileSync(file, content);
console.log('Super Admin patch complete.');
