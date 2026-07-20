import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Find the iframe part
    old_iframe = """                          <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          ></iframe>"""

    new_iframe = """                          <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          ></iframe>
                          <a href={`https://maps.google.com/?q=${encodeURIComponent(location)}`} target="_blank" rel="noopener noreferrer" className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-bold text-amber-700 shadow-md border border-amber-100 hover:bg-amber-50 transition-colors flex items-center gap-1 z-10">
                            Buka di Maps
                          </a>"""

    content = content.replace(old_iframe, new_iframe)
    
    # Also add relative to the container if not there
    old_container = """<div className="w-full h-48 md:h-56 rounded-xl overflow-hidden shadow-inner border border-gray-200 mt-2">"""
    new_container = """<div className="w-full h-48 md:h-56 rounded-xl overflow-hidden shadow-inner border border-gray-200 mt-2 relative">"""
    
    content = content.replace(old_container, new_container)

    with open(filepath, "w") as f:
        f.write(content)

patch("src/components/DigitalInvitation.tsx")
