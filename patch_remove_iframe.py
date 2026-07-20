import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_iframe = """                          <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          ></iframe>"""

    new_map_bg = """                          <div className="absolute inset-0 bg-amber-50 flex flex-col items-center justify-center opacity-80 pointer-events-none">
                            <MapPin className="w-10 h-10 text-amber-300 mb-2" />
                            <span className="text-[10px] text-amber-600/70 uppercase tracking-widest font-bold">Peta Lokasi</span>
                          </div>"""

    content = content.replace(old_iframe, new_map_bg)

    with open(filepath, "w") as f:
        f.write(content)

patch("src/components/DigitalInvitation.tsx")
