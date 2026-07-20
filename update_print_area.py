import sys
import re

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    new_print_area = """
              <div 
                id="letter-print-area" 
                className="bg-white shadow-lg relative overflow-hidden"
                style={{ 
                  width: '794px',
                  minHeight: '1123px',
                }}
              >
                <DigitalInvitation 
                  eventName={selectedEvent.eventName || 'Nama Acara'}
                  eventDate={selectedEvent.eventDate || new Date().toISOString()}
                  location={selectedEvent.location || 'Lokasi Acara'}
                  guestName={printingGuest.guestName}
                  heroImage={selectedEvent.heroImage || null}
                  background={selectedEvent.letterBackground || null}
                  content={selectedEvent.letterContent || ''}
                  backsound={selectedEvent.backsound || null}
                  isPreview={true}
                  isPrint={true}
                />
              </div>
"""

    content = re.sub(
        r'<div\s+id="letter-print-area".*?<\/div>\s*<\/div>',
        new_print_area.strip() + '\n            </div>',
        content,
        flags=re.DOTALL
    )

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/OfficeAdminDashboard.tsx")
