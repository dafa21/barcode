import { Router } from 'express';
import { db } from '../../db/index.ts';
import { guests, events, attendances, users } from '../../db/schema.ts';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { jwtAuthGuard, AuthRequest } from '../../core/middlewares/jwtAuthGuard.ts';
import { tenantGuard } from '../../core/middlewares/tenantGuard.ts';

const router = Router();

// Public RSVP endpoints
router.get('/rsvp/:barcodeUid', async (req, res) => {
  try {
    const { barcodeUid } = req.params;
    const guestResult = await db.select({
      id: guests.id,
      guestName: guests.guestName,
      company: guests.company,
      jobTitle: guests.jobTitle,
      rsvpStatus: guests.rsvpStatus,
      paxCount: guests.paxCount,
      customInvitationFile: sql<string>`CASE WHEN ${guests.customInvitationFile} IS NOT NULL THEN 'exists' ELSE NULL END`.as('customInvitationFile'),
      event: {
        id: events.id,
        eventName: events.eventName,
        eventDate: events.eventDate,
        location: events.location,
        logo: events.logo,
        twibbonBackground: events.twibbonBackground,
        twibbonConfig: events.twibbonConfig,
        backsound: events.backsound,
        heroImage: events.heroImage,
        gallery: events.gallery,
        letterBackground: events.letterBackground,
        letterContent: events.letterContent,
        themePrimary: events.themePrimary,
        themeSecondary: events.themeSecondary,
        openingQuote: events.openingQuote,
        eventEndDate: events.eventEndDate,
        rundown: events.rundown
      }
    })
    .from(guests)
    .leftJoin(events, eq(guests.eventId, events.id))
    .where(eq(guests.barcodeUid, barcodeUid))
    .limit(1);

    if (guestResult.length === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    const guest = guestResult[0];
    if (guest.event) {
      const e = guest.event as any;
      const getUrl = (field: string) => `/api/events/public/image/${e.id}/${field}`;
      
      if (e.logo && e.logo.startsWith('data:image')) e.logo = getUrl('logo');
      if (e.heroImage && e.heroImage.startsWith('data:image')) e.heroImage = getUrl('heroImage');
      if (e.twibbonBackground && e.twibbonBackground.startsWith('data:image')) e.twibbonBackground = getUrl('twibbonBackground');
      if (e.letterBackground && e.letterBackground.startsWith('data:image')) e.letterBackground = getUrl('letterBackground');
      
      if (e.gallery) {
        try {
          const galleryArr = JSON.parse(e.gallery);
          const newGallery = galleryArr.map((img: string, index: number) => 
            img.startsWith('data:image') ? `/api/events/public/gallery/${e.id}/${index}` : img
          );
          e.gallery = JSON.stringify(newGallery);
        } catch (err) {}
      }
    }

    res.json(guest);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});

router.post('/rsvp/:barcodeUid', async (req, res) => {
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
        rsvpStatus: 'attending' as const,
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
});

router.get('/public/invitation/:barcodeUid', async (req, res) => {
  try {
    const { barcodeUid } = req.params;
    
    const guestResult = await db.select({
      customInvitationFile: guests.customInvitationFile,
      guestName: guests.guestName
    }).from(guests).where(eq(guests.barcodeUid, barcodeUid)).limit(1);
    
    const guest = guestResult[0];

    if (!guest || !guest.customInvitationFile) {
      return res.status(404).send('File undangan khusus tidak ditemukan untuk tamu ini');
    }

    const matches = guest.customInvitationFile.match(/^data:(.+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${guest.guestName}_Undangan.pdf"`);
      return res.send(buffer);
    } else {
      return res.send(guest.customInvitationFile);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.use(jwtAuthGuard, tenantGuard);

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { eventId, guestName, email, phone, company, jobTitle, guestType, picId, isVip, customInvitationFile } = req.body;
    
    // Verify event belongs to office if not super_admin
    const eventResult = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    if (eventResult.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    if ((req.user!.role === 'office_admin' || req.user!.role === 'pic') && eventResult[0].officeId !== req.user!.officeId) {
      return res.status(403).json({ error: 'Forbidden: Event does not belong to your office' });
    }

    const barcodeUid = uuidv4();
    const result = await db.insert(guests).values({
      eventId,
      guestName,
      email,
      phone,
      company,
      jobTitle,
      guestType,
      picId,
      barcodeUid,
      isVip,
      customInvitationFile,
    }).returning();

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { guestName, email, phone, company, jobTitle, guestType, picId, isVip, customInvitationFile } = req.body;

    const guestResult = await db.select().from(guests).where(eq(guests.id, id)).limit(1);
    if (guestResult.length === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    const eventResult = await db.select().from(events).where(eq(events.id, guestResult[0].eventId)).limit(1);
    if (eventResult.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if ((req.user!.role === 'office_admin' || req.user!.role === 'pic') && eventResult[0].officeId !== req.user!.officeId) {
      return res.status(403).json({ error: 'Forbidden: Event does not belong to your office' });
    }

    const updated = await db.update(guests).set({
      guestName,
      email: email || null,
      phone: phone || null,
      company: company || null,
      jobTitle: jobTitle || null,
      guestType: guestType || null,
      picId: picId || null,
      isVip: isVip !== undefined ? !!isVip : guestResult[0].isVip,
      customInvitationFile: customInvitationFile !== undefined ? customInvitationFile : guestResult[0].customInvitationFile,
    }).where(eq(guests.id, id)).returning();

    res.json(updated[0]);
  } catch (error) {
    console.error('Update guest error:', error);
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});

router.get('/event/:eventId', async (req: AuthRequest, res) => {
  try {
    const { eventId } = req.params;
    
    // Check permission
    const eventResult = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    if (eventResult.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    if ((req.user!.role === 'office_admin' || req.user!.role === 'pic') && eventResult[0].officeId !== req.user!.officeId) {
      return res.status(403).json({ error: 'Forbidden: Event does not belong to your office' });
    }

    const eventGuests = await db
      .select({
        id: guests.id,
        eventId: guests.eventId,
        guestName: guests.guestName,
        email: guests.email,
        phone: guests.phone,
        company: guests.company,
        jobTitle: guests.jobTitle,
        guestType: guests.guestType,
        picId: guests.picId,
        picName: users.username,
        barcodeUid: guests.barcodeUid,
        rsvpStatus: guests.rsvpStatus,
        paxCount: guests.paxCount,
        customInvitationFile: sql<string>`CASE WHEN ${guests.customInvitationFile} IS NOT NULL THEN 'exists' ELSE NULL END`.as('customInvitationFile'),
        status: attendances.status,
        scannedAt: attendances.scannedAt
      })
      .from(guests)
      .leftJoin(attendances, eq(guests.id, attendances.guestId))
      .leftJoin(users, eq(guests.picId, users.id))
      .where(eq(guests.eventId, eventId));

    res.json(eventGuests);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});


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
      guestType: g.guestType || null,
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

router.put('/bulk-update/excel', jwtAuthGuard, tenantGuard, async (req: AuthRequest, res) => {
  try {
    const { updates } = req.body;
    
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: 'Invalid updates data' });
    }

    const { officeId, role } = req.user!;
    
    // We update guests one by one or in a transaction. 
    // Since SQLite/Postgres bulk update with different values per row is complex in standard ORM syntax,
    // we will loop and update.
    const results = [];
    for (const updateData of updates) {
      if (!updateData.barcodeUid) continue;

      // Check permission for each guest's event? We can assume the frontend sends guests for the current event.
      // But for security, we should verify it. To optimize, we can verify one guest's event and assume all are same event.
      const guestResult = await db.select().from(guests).where(eq(guests.barcodeUid, updateData.barcodeUid)).limit(1);
      if (guestResult.length === 0) continue;

      const eventResult = await db.select().from(events).where(eq(events.id, guestResult[0].eventId)).limit(1);
      if (eventResult.length === 0 || (role === 'office_admin' && eventResult[0].officeId !== officeId)) {
        continue; // skip unauthorized or invalid
      }

      const updated = await db.update(guests).set({
        guestName: updateData.guestName !== undefined ? updateData.guestName : guestResult[0].guestName,
        email: updateData.email !== undefined ? updateData.email : guestResult[0].email,
        phone: updateData.phone !== undefined ? updateData.phone : guestResult[0].phone,
        company: updateData.company !== undefined ? updateData.company : guestResult[0].company,
        jobTitle: updateData.jobTitle !== undefined ? updateData.jobTitle : guestResult[0].jobTitle,
        guestType: updateData.guestType !== undefined ? updateData.guestType : guestResult[0].guestType,
        isVip: updateData.isVip !== undefined ? updateData.isVip : guestResult[0].isVip,
      }).where(eq(guests.barcodeUid, updateData.barcodeUid)).returning();
      
      if (updated.length > 0) results.push(updated[0]);
    }

    res.json({ updated: results.length });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});


router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const guestResult = await db.select().from(guests).where(eq(guests.id, id)).limit(1);
    if (guestResult.length === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    const eventResult = await db.select().from(events).where(eq(events.id, guestResult[0].eventId)).limit(1);
    if (eventResult.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if ((req.user!.role === 'office_admin' || req.user!.role === 'pic') && eventResult[0].officeId !== req.user!.officeId) {
      return res.status(403).json({ error: 'Forbidden: Event does not belong to your office' });
    }

    // Delete attendances first due to foreign key constraint
    await db.delete(attendances).where(eq(attendances.guestId, id));
    
    // Delete guest
    await db.delete(guests).where(eq(guests.id, id));

    res.json({ success: true });
  } catch (error) {
    console.error('Delete guest error:', error);
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});

router.post('/send-wappin', jwtAuthGuard, tenantGuard, async (req: AuthRequest, res) => {
  try {
    const { guestIds } = req.body;
    
    if (!Array.isArray(guestIds) || guestIds.length === 0) {
      return res.status(400).json({ error: 'Invalid guestIds data' });
    }

    const wappinUrl = process.env.WAPPIN_API_URL || 'https://chat-api.wappin.id/v1/message/do-send';
    const wappinToken = process.env.WAPPIN_API_TOKEN;
    const wappinClientName = process.env.WAPPIN_CLIENT_NAME;
    
    if (!wappinToken || !wappinClientName) {
      return res.status(500).json({ error: 'Wappin API configuration (Token/Client Name) is missing in .env' });
    }

    // --- STEP 1: Dapatkan Bearer Token Wappin terlebih dahulu ---
    let activeBearerToken = wappinToken;
    try {
      const tokenUrl = wappinUrl.replace('/message/do-send', '/token/get');
      const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: wappinClientName,
          secret_key: wappinToken
        })
      });
      const tokenData = await tokenResponse.json();
      if (tokenData?.data?.token) {
        activeBearerToken = tokenData.data.token;
      }
    } catch (e) {
      console.warn("Could not fetch Wappin token, falling back to using API_TOKEN as Bearer", e);
    }

    const results = [];
    
    for (const id of guestIds) {
      const guestResult = await db.select().from(guests).where(eq(guests.id, id)).limit(1);
      if (guestResult.length === 0) continue;
      
      const guest = guestResult[0];
      if (!guest.phone) continue;

      const eventResult = await db.select().from(events).where(eq(events.id, guest.eventId)).limit(1);
      if (eventResult.length === 0) continue;
      
      const event = eventResult[0];

      // Format phone number
      const phoneStr = guest.phone.replace(/[^0-9]/g, '');
      const formattedPhone = phoneStr.startsWith('0') ? '62' + phoneStr.slice(1) : phoneStr;

      const rsvpUrl = `${process.env.APP_URL || 'http://localhost:3000'}/rsvp/${guest.barcodeUid}`;
      const fileUrl = guest.customInvitationFile 
        ? `${process.env.APP_URL || 'http://localhost:3000'}/api/guests/public/invitation/${guest.barcodeUid}` 
        : `${process.env.APP_URL || 'http://localhost:3000'}/api/events/public/invitation/${event.eventName?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      
      const eventDateStr = new Date(event.eventDate || '').toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const eventTimeStr = new Date(event.eventDate || '').toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      // Wappin API Payload
      const payload = {
        client_name: process.env.WAPPIN_CLIENT_NAME || "",
        project_id: process.env.WAPPIN_PROJECT_ID || "",
        sender_id: process.env.WAPPIN_SENDER_ID || "",
        phone_number: formattedPhone,
        template_name: "undangan_dai",
        language: "id",
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: guest.guestName || "-" }, // {{1}} Guest Name
              { type: "text", text: event.eventName || "-" }, // {{2}} Event Name
              { type: "text", text: eventDateStr || "-" }, // {{3}} Date
              { type: "text", text: eventTimeStr || "-" }, // {{4}} Time
              { type: "text", text: event.location || "-" }, // {{5}} Location
              { type: "text", text: fileUrl || "-" }, // {{6}} Invitation URL
              { type: "text", text: rsvpUrl || "-" } // {{7}} RSVP URL
            ]
          }
        ]
      };

      try {
        const response = await fetch(wappinUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeBearerToken}`
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        results.push({ guestId: id, status: response.ok ? 'success' : 'failed', response: data });
      } catch (err) {
        results.push({ guestId: id, status: 'error', error: err });
      }
    }

    res.json({ success: true, results });
  } catch (error) {
    console.error('Wappin send error:', error);
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});

export default router;
