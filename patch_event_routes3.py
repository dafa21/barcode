import sys
import re

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    new_top = """const router = Router();

// Public routes
router.get('/public/invitation/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const allEvents = await db.select().from(events);
    const event = allEvents.find(e => 
      e.eventName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
    );
    
    if (!event) {
      return res.status(404).send('Undangan tidak ditemukan');
    }
    
    if (!event.invitationFile) {
      return res.status(404).send('File undangan belum diunggah untuk acara ini');
    }

    const matches = event.invitationFile.match(/^data:(.+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${event.eventName}_Undangan.pdf"`);
      return res.send(buffer);
    } else {
      return res.send(event.invitationFile);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.use(jwtAuthGuard, tenantGuard);"""

    content = re.sub(r'const router = Router\(\);\s*router\.use\(jwtAuthGuard, tenantGuard\);', new_top, content)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/modules/events/event.routes.ts")
