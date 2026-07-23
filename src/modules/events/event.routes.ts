import { Router } from 'express';
import { db } from '../../db/index.ts';
import { events, guests, attendances } from '../../db/schema.ts';
import { eq } from 'drizzle-orm';
import { jwtAuthGuard, AuthRequest } from '../../core/middlewares/jwtAuthGuard.ts';
import { tenantGuard } from '../../core/middlewares/tenantGuard.ts';

const router = Router();

// Public routes
router.get('/public/invitation/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // First, fetch only the IDs and eventNames to find the matching slug without loading huge files
    const allEventsLight = await db.select({
      id: events.id,
      eventName: events.eventName
    }).from(events);
    
    const matchedEvent = allEventsLight.find(e => 
      e.eventName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
    );
    
    if (!matchedEvent) {
      return res.status(404).send('Undangan tidak ditemukan');
    }
    
    // Then fetch only the invitationFile for that specific event
    const eventResult = await db.select({
      eventName: events.eventName,
      invitationFile: events.invitationFile
    }).from(events).where(eq(events.id, matchedEvent.id)).limit(1);
    
    const event = eventResult[0];

    if (!event || !event.invitationFile) {
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

router.use(jwtAuthGuard, tenantGuard);

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { eventName, eventDate, location, mapsLink, isActive, logo, twibbonBackground, twibbonConfig, invitationFile, letterBackground, letterSize, letterContent, backsound, heroImage,
      gallery, themePrimary, themeSecondary, openingQuote, eventEndDate, rundown, socialWebsite, socialYoutube, socialInstagram } = req.body;
    let targetOfficeId = req.user!.officeId;
    
    if (req.user!.role === 'super_admin') {
      targetOfficeId = req.body.officeId;
      if (!targetOfficeId) {
        return res.status(400).json({ error: 'officeId is required for super_admin' });
      }
    }

    const result = await db.insert(events).values({
      officeId: targetOfficeId,
      eventName,
      eventDate: new Date(eventDate),
      location,
      mapsLink,
      isActive: isActive !== undefined ? isActive : true,
      logo,
      twibbonBackground,
      twibbonConfig,
      invitationFile,
      letterBackground,
      letterSize,
      letterContent,
      backsound,
      heroImage,
      gallery,
      themePrimary,
      themeSecondary,
      openingQuote,
      eventEndDate: eventEndDate ? new Date(eventEndDate) : null,
      rundown,
      socialWebsite,
      socialYoutube,
      socialInstagram,
    }).returning();
    
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});

router.get('/', async (req: AuthRequest, res) => {
  try {
    const { role, officeId } = req.user!;
    let userEvents;
    
    const lightSelect = {
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
    }
    
    res.json(userEvents);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});


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

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { eventName, eventDate, location, mapsLink, isActive, logo, twibbonBackground, twibbonConfig, invitationFile, letterBackground, letterSize, letterContent, backsound, heroImage,
      gallery, themePrimary, themeSecondary, openingQuote, eventEndDate, rundown, socialWebsite, socialYoutube, socialInstagram } = req.body;
    const { role, officeId } = req.user!;
    
    // Authorization check
    const event = await db.select().from(events).where(eq(events.id, id));
    if (event.length === 0) return res.status(404).json({ error: 'Event not found' });
    if (role !== 'super_admin' && event[0].officeId !== officeId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await db.update(events)
      .set({
        eventName,
        eventDate: new Date(eventDate),
        location,
        mapsLink,
        isActive,
        logo,
        twibbonBackground,
        twibbonConfig,
        invitationFile,
        letterBackground,
        letterSize,
        letterContent,
      backsound,
      heroImage,
      gallery,
      themePrimary,
      themeSecondary,
      openingQuote,
      eventEndDate: eventEndDate ? new Date(eventEndDate) : null,
      rundown,
      socialWebsite,
      socialYoutube,
      socialInstagram,
      })
      .where(eq(events.id, id))
      .returning();
      
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { role, officeId } = req.user!;
    
    const event = await db.select().from(events).where(eq(events.id, id));
    if (event.length === 0) return res.status(404).json({ error: 'Event not found' });
    if (role !== 'super_admin' && event[0].officeId !== officeId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Delete cascading manually
    await db.delete(attendances).where(eq(attendances.eventId, id));
    await db.delete(guests).where(eq(guests.eventId, id));
    await db.delete(events).where(eq(events.id, id));
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
