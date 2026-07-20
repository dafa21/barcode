import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Import FileText
    old_import = "import { Users, Calendar, QrCode, LogOut, CheckCircle, Search, FileDown, Upload, X, MapPin, Play, Settings, Filter, Download, MessageCircle, Printer, Plus, Trash2, Camera, Eye } from 'lucide-react';"
    new_import = "import { Users, Calendar, QrCode, LogOut, CheckCircle, Search, FileDown, Upload, X, MapPin, Play, Settings, Filter, Download, MessageCircle, Printer, Plus, Trash2, Camera, Eye, FileText } from 'lucide-react';"
    content = content.replace(old_import, new_import)

    # Add button next to Print Barcode
    old_actions = """                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex items-center justify-end gap-3">
                                    <button 
                                      onClick={() => handlePrintBarcode(guest.barcodeUid, guest.guestName)}
                                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                                      title="Print Badge"
                                    >
                                      <Printer className="w-4 h-4" />
                                    </button>"""
    new_actions = """                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex items-center justify-end gap-3">
                                    <button 
                                      onClick={() => setPrintingGuest(guest)}
                                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                                      title="Cetak Surat Undangan"
                                    >
                                      <FileText className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => handlePrintBarcode(guest.barcodeUid, guest.guestName)}
                                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                                      title="Print Badge"
                                    >
                                      <Printer className="w-4 h-4" />
                                    </button>"""
    content = content.replace(old_actions, new_actions)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
