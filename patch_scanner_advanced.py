import sys
import re

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Import RefreshCcw
    content = content.replace("Camera, Clock } from 'lucide-react';", "Camera, Clock, RefreshCcw } from 'lucide-react';")

    # Add facingMode state
    old_state = r"const \[useCamera, setUseCamera\] = useState\(false\);"
    new_state = r"const [useCamera, setUseCamera] = useState(false);\n  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');"
    content = re.sub(old_state, new_state, content)

    # Make scanner larger (design improvement)
    old_scanner_div = r"className=\"w-full h-64 max-w-sm mx-auto overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm relative\""
    new_scanner_div = r"className=\"w-full aspect-[3/4] max-w-sm mx-auto overflow-hidden rounded-3xl border-4 border-white/50 bg-black/5 shadow-2xl relative backdrop-blur-sm\""
    content = re.sub(old_scanner_div, new_scanner_div, content)

    # Add facing mode constraints
    old_qr_props = r"scanDelay=\{2000\}"
    new_qr_props = r"scanDelay={2000}\n                  constraints={{ facingMode }}"
    content = re.sub(old_qr_props, new_qr_props, content)

    # Update speech utterance
    old_utterance = r"Selamat datang, \$\{data\.guest\.guestName\}"
    new_utterance = r"Selamat datang Bapak atau Ibu ${data.guest.guestName}, terima kasih atas kehadirannya. Silakan masuk"
    content = re.sub(old_utterance, new_utterance, content)

    # Add toggle button
    old_buttons = r"<button\n              onClick=\{\(\) => setUseCamera\(!useCamera\)\}\n              className=\"flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 text-\[10px\] font-bold uppercase tracking-widest rounded-lg transition-colors border border-gray-200 shadow-sm\"\n            >\n              <Camera className=\"w-4 h-4\" />\n              \{useCamera \? 'Use Physical Scanner' : 'Use Camera Scanner'\}\n            </button>"
    
    new_buttons = r"""<button
              onClick={() => setUseCamera(!useCamera)}
              className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors border border-gray-200 shadow-sm"
            >
              <Camera className="w-4 h-4" />
              {useCamera ? 'Use Physical Scanner' : 'Use Camera Scanner'}
            </button>
            {useCamera && (
              <button
                onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
                className="flex items-center justify-center w-12 h-12 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors border border-gray-200 shadow-sm"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            )}"""
    
    content = re.sub(old_buttons, new_buttons, content)

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/Scanner.tsx")
