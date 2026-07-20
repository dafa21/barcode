import sys

def patch(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Find the GET / route
    old_logic = """    if (role === 'super_admin') {
      userEvents = await db.select().from(events);
    } else {
      userEvents = await db.select().from(events).where(eq(events.officeId, officeId));
    }"""

    new_logic = """    const lightSelect = {
      id: events.id,
      officeId: events.officeId,
      eventName: events.eventName,
      eventDate: events.eventDate,
      location: events.location,
      isActive: events.isActive,
    };

    if (role === 'super_admin') {
      userEvents = await db.select(lightSelect).from(events);
    } else {
      userEvents = await db.select(lightSelect).from(events).where(eq(events.officeId, officeId));
    }"""

    content = content.replace(old_logic, new_logic)

    with open(filepath, "w") as f:
        f.write(content)

patch("src/modules/events/event.routes.ts")
