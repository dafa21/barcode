import sys
import re

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Import Crown
    content = content.replace("RefreshCcw } from 'lucide-react';", "RefreshCcw, Crown } from 'lucide-react';")

    # Add isVip state
    old_state = r"const \[recentScans, setRecentScans\] = useState<RecentScan\[\]>\(\[\]\);"
    new_state = "const [recentScans, setRecentScans] = useState<RecentScan[]>([]);\n  const [isVip, setIsVip] = useState(false);"
    content = re.sub(old_state, new_state, content)

    # Set isVip true on success
    old_success = r"setStatus\('success'\);\n        setMessage"
    new_success = "setStatus('success');\n        setIsVip(!!data.guest?.isVip);\n        setMessage"
    content = re.sub(old_success, new_success, content)

    # Reset isVip on timeout
    old_reset = r"setStatus\('idle'\);\n        setMessage\(''\);"
    new_reset = "setStatus('idle');\n        setMessage('');\n        setIsVip(false);"
    content = re.sub(old_reset, new_reset, content)

    # Add badge to camera success
    old_camera_success = r"<CheckCircle2 className=\"w-16 h-16 mb-4 animate-\[bounce_0\.5s_ease-in-out_1\]\" />"
    new_camera_success = r"""{isVip && (
                      <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg flex items-center gap-1 animate-bounce">
                        <Crown className="w-4 h-4" /> VIP
                      </div>
                    )}
                    <CheckCircle2 className="w-16 h-16 mb-4 animate-[bounce_0.5s_ease-in-out_1]" />"""
    content = re.sub(old_camera_success, new_camera_success, content)

    # Add badge to physical success
    old_physical_success = r"<CheckCircle2 className=\"w-24 h-24 text-emerald-500 animate-\[bounce_0\.5s_ease-in-out_1\]\" />"
    new_physical_success = r"""{isVip && (
                      <div className="absolute top-[-10px] right-[-10px] bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1 animate-bounce z-20">
                        <Crown className="w-3 h-3" /> VIP
                      </div>
                    )}
                    <CheckCircle2 className="w-24 h-24 text-emerald-500 animate-[bounce_0.5s_ease-in-out_1]" />"""
    content = re.sub(old_physical_success, new_physical_success, content)

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/components/Scanner.tsx")
