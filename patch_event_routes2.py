import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # We add public routes before router.use(jwtAuthGuard, tenantGuard);
    old_top = "const router = Router();router.use(jwtAuthGuard, tenantGuard);"

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

    content = content.replace(old_top, new_top)

    old_update_set = """        twibbonBackground,
        twibbonConfig,
      })"""
    new_update_set = """        twibbonBackground,
        twibbonConfig,
        invitationFile,
      })"""
    content = content.replace(old_update_set, new_update_set)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/modules/events/event.routes.ts")
