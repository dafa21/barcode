import sys
import re

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Update haptic and add speech
    old_success_action = r"        if \(typeof window !== 'undefined' && window\.navigator && window\.navigator\.vibrate\) \{\n          window\.navigator\.vibrate\(\[100, 50, 100\]\);\n        \}"
    new_success_action = r"""        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate([200, 100, 200]);
        }
        
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(`Selamat datang, ${data.guest.guestName}`);
          utterance.lang = 'id-ID';
          utterance.rate = 0.9;
          window.speechSynthesis.speak(utterance);
        }"""
    content = re.sub(old_success_action, new_success_action, content)

    # Add ping animation to non-camera success
    old_physical_success = r"\{status === 'success' \? <CheckCircle2 className=\"w-24 h-24 text-emerald-500\" /> :"
    new_physical_success = r"{status === 'success' ? (\n                  <>\n                    <div className=\"absolute inset-0 bg-emerald-400 opacity-20 rounded-3xl animate-[ping_1s_cubic-bezier(0,0,0.2,1)_1]\"></div>\n                    <CheckCircle2 className=\"w-24 h-24 text-emerald-500 animate-[bounce_0.5s_ease-in-out_1]\" />\n                  </>\n                ) :"
    content = re.sub(old_physical_success, new_physical_success, content)

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/Scanner.tsx")
