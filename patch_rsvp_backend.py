import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    old_post = """router.post('/rsvp/:barcodeUid', async (req, res) => {
  try {
    const { barcodeUid } = req.params;
    const { rsvpStatus, paxCount } = req.body;
    
    const guestResult = await db.select().from(guests).where(eq(guests.barcodeUid, barcodeUid)).limit(1);
    if (guestResult.length === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    const updated = await db.update(guests)
      .set({ 
        rsvpStatus: rsvpStatus || 'attending', 
        paxCount: paxCount || 1 
      })
      .where(eq(guests.barcodeUid, barcodeUid))
      .returning();

    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});"""

    new_post = """router.post('/rsvp/:barcodeUid', async (req, res) => {
  try {
    const { barcodeUid } = req.params;
    const { rsvpStatus, paxCount, additionalGuests } = req.body;
    
    const guestResult = await db.select().from(guests).where(eq(guests.barcodeUid, barcodeUid)).limit(1);
    if (guestResult.length === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    const mainGuest = guestResult[0];

    const updated = await db.update(guests)
      .set({ 
        rsvpStatus: rsvpStatus || 'attending', 
        paxCount: paxCount || 1 
      })
      .where(eq(guests.barcodeUid, barcodeUid))
      .returning();

    if (rsvpStatus === 'attending' && paxCount > 1 && Array.isArray(additionalGuests) && additionalGuests.length > 0) {
      const newGuests = additionalGuests.map((ag: any) => ({
        eventId: mainGuest.eventId,
        picId: mainGuest.picId,
        company: mainGuest.company,
        guestName: ag.guestName,
        phone: ag.phone,
        jobTitle: ag.jobTitle || null,
        barcodeUid: uuidv4(),
        rsvpStatus: 'attending',
        paxCount: 1
      }));
      
      if (newGuests.length > 0) {
        await db.insert(guests).values(newGuests);
      }
    }

    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});"""
    content = content.replace(old_post, new_post)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/modules/guests/guest.routes.ts")
