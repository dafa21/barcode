import sys
import re

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    bulk_route = """
router.post('/bulk', jwtAuthGuard, tenantGuard, async (req: AuthRequest, res) => {
  try {
    const { guests: newGuests } = req.body;
    
    if (!Array.isArray(newGuests) || newGuests.length === 0) {
      return res.status(400).json({ error: 'Invalid guests data' });
    }

    const { officeId, role } = req.user!;
    
    // Check if event belongs to the office
    const eventId = newGuests[0].eventId;
    const eventResult = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    if (eventResult.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    if (role === 'office_admin' && eventResult[0].officeId !== officeId) {
      return res.status(403).json({ error: 'Forbidden: Event does not belong to your office' });
    }

    const values = newGuests.map(g => ({
      eventId: g.eventId,
      guestName: g.guestName,
      email: g.email || null,
      phone: g.phone || null,
      company: g.company || null,
      jobTitle: g.jobTitle || null,
      picId: g.picId || null,
      isVip: !!g.isVip,
      barcodeUid: uuidv4()
    }));

    const result = await db.insert(guests).values(values).returning();
    res.json(result);
  } catch (error) {
    console.error('Bulk insert error:', error);
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});
"""
    content = content.replace("export default router;", bulk_route + "\nexport default router;")

    with open(filepath, "w") as f:
        f.write(content)
    print("Success")

patch("src/modules/guests/guest.routes.ts")
