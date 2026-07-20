import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    map_code = """
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-amber-800/60 font-sans font-bold mb-1">Lokasi</p>
                      <span className="text-sm font-medium block leading-relaxed mb-4">{location}</span>
                      
                      {!isPrint && (
                        <div className="w-full h-48 md:h-56 rounded-xl overflow-hidden shadow-inner border border-gray-200 mt-2">
                          <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          ></iframe>
                        </div>
                      )}
                    </div>
"""
    
    # original code:
    #                     <div>
    #                       <p className="text-[10px] uppercase tracking-widest text-amber-800/60 font-sans font-bold mb-1">Lokasi</p>
    #                       <span className="text-sm font-medium block leading-relaxed">{location}</span>
    #                     </div>
    content = content.replace(
        '<div>\n                      <p className="text-[10px] uppercase tracking-widest text-amber-800/60 font-sans font-bold mb-1">Lokasi</p>\n                      <span className="text-sm font-medium block leading-relaxed">{location}</span>\n                    </div>',
        map_code.strip()
    )

    with open(filepath, "w") as f:
        f.write(content)

patch("src/components/DigitalInvitation.tsx")
