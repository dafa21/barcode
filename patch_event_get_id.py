import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    new_route = """
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { role, officeId } = req.user!;
    
    const eventResult = await db.select().from(events).where(eq(events.id, id));
    if (eventResult.length === 0) return res.status(404).json({ error: 'Event not found' });
    
    if (role !== 'super_admin' && eventResult[0].officeId !== officeId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    res.json(eventResult[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
"""
    if "router.get('/:id'" not in content:
        content = content.replace("router.put('/:id'", new_route + "\nrouter.put('/:id'")
        with open(filepath, "w") as f:
            f.write(content)
        print("Patched event routes")

patch("src/modules/events/event.routes.ts")
