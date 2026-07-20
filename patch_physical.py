import sys
import re

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Box styles
    old_box = r"status === 'idle' \? 'bg-white/80 border-gray-200 shadow-sm' :"
    new_box = r"status === 'idle' ? 'bg-white/60 border-white/60 shadow-[0_8px_32px_rgba(99,102,241,0.15)]' :"
    content = re.sub(old_box, new_box, content)

    # Corner accents
    old_accents = r'<div className="absolute (top|bottom)-4 (left|right)-4 w-4 h-4 border-(t|b)-2 border-(l|r)-2 border-gray-200"></div>'
    new_accents = r'<div className="absolute \1-4 \2-4 w-4 h-4 border-\3-2 border-\4-2 border-indigo-300"></div>'
    content = re.sub(old_accents, new_accents, content)

    # Text gradient for the greeting message
    old_msg = r'text-xl font-serif tracking-wide \$\{status === \'success\' \? \'text-emerald-600\' : \'text-red-600\'\}'
    new_msg = r'text-xl font-bold tracking-wide ${status === "success" ? "bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent" : "bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent"}'
    content = content.replace(old_msg, new_msg)

    # Update camera toggle buttons
    old_buttons = r'bg-white hover:bg-gray-50 text-gray-700 text-\[10px\] font-bold uppercase tracking-widest rounded-lg transition-colors border border-gray-200 shadow-sm'
    new_buttons = r'bg-white/80 backdrop-blur hover:bg-white text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all border border-indigo-100 shadow-[0_4px_12px_rgba(99,102,241,0.1)] hover:shadow-[0_4px_16px_rgba(99,102,241,0.2)]'
    content = content.replace(old_buttons, new_buttons)

    # Update scanner text color to match the colorful vibe
    old_scanner_text = r'text-gray-300'
    new_scanner_text = r'text-indigo-200/50'
    content = content.replace(old_scanner_text, new_scanner_text)
    
    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/Scanner.tsx")
