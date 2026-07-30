import { Router } from 'express';
import { db } from '../../db/index.ts';
import { guests, events, attendances, users } from '../../db/schema.ts';
import { eq, sql, inArray } from 'drizzle-orm';
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

// Fungsi handler untuk download PDF
const handleGuestInvitation = async (req: any, res: any) => {
  try {
    let { barcodeUid } = req.params;
    if (barcodeUid.endsWith('/undangan.pdf')) barcodeUid = barcodeUid.replace('/undangan.pdf', '');

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
      res.setHeader('Content-Type', mimeType || 'application/pdf');
      res.setHeader('Content-Length', buffer.length);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Biar Cloudflare bantu meloloskan
      res.setHeader('Content-Disposition', `attachment; filename="${guest.guestName.replace(/[^a-zA-Z0-9]/g, '_')}_Undangan.pdf"`);
      return res.end(buffer);
    } else {
      return res.send(guest.customInvitationFile);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Daftarkan kedua endpoint agar Meta Crawler bisa membaca akhiran .pdf
router.get('/public/invitation/:barcodeUid/undangan.pdf', handleGuestInvitation);
router.get('/public/invitation/:barcodeUid([^/]+(?:/undangan\\.pdf)?)', handleGuestInvitation);
router.get('/public/invitation/:barcodeUid', handleGuestInvitation);

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
        isVip: guests.isVip,
        wappinSent: guests.wappinSent,
        manualWaSent: guests.manualWaSent,
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

router.get('/wappin-config', jwtAuthGuard, tenantGuard, (req, res) => {
  res.json({
    wappinUrl: process.env.WAPPIN_API_URL ? process.env.WAPPIN_API_URL.replace(/["']/g, '') : 'https://api.chat.wappin.app/v1/messages',
    wappinToken: process.env.WAPPIN_API_TOKEN,
    wappinClientName: process.env.WAPPIN_CLIENT_NAME,
    wappinProjectId: process.env.WAPPIN_PROJECT_ID,
    wappinSenderId: process.env.WAPPIN_SENDER_ID,
    appUrl: process.env.APP_URL || 'http://localhost:3000'
  });
});

router.post('/mark-manual-wa', jwtAuthGuard, tenantGuard, async (req: AuthRequest, res) => {
  try {
    const { guestIds } = req.body;
    if (!guestIds || !Array.isArray(guestIds)) {
      return res.status(400).json({ error: 'guestIds must be an array' });
    }

    const { officeId } = req.user!;

    const targetGuests = await db.select().from(guests).where(inArray(guests.id, guestIds));
    if (targetGuests.length === 0) return res.status(404).json({ error: 'Guests not found' });

    await db.update(guests).set({ manualWaSent: true }).where(inArray(guests.id, guestIds));

    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('Mark manual WA error:', error);
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});

  // Dedicated physical file downloader to bypass Vite/Express static middleware issues
  router.get('/download-physical-pdf/:filename', (req, res) => {
    const isDev = process.env.NODE_ENV !== 'production';
    const staticDir = isDev ? path.join(process.cwd(), 'public') : path.join(process.cwd(), 'dist');
    const pdfDir = path.join(staticDir, 'wappin_pdf');
    const filePath = path.join(pdfDir, req.params.filename);
    
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${req.params.filename}"`);
      res.sendFile(filePath);
    } else {
      res.status(404).send('PDF not found di physical drive');
    }
  });

router.post('/send-wappin', jwtAuthGuard, tenantGuard, async (req: AuthRequest, res) => {
  try {
    const { guestIds } = req.body;
    if (!guestIds || !Array.isArray(guestIds)) {
      return res.status(400).json({ error: 'guestIds must be an array' });
    }

    const { officeId } = req.user!;

    // 1. Dapatkan Bearer Token Wappin 2.0 dari Endpoint Login
    const wappinClientName = process.env.WAPPIN_CLIENT_NAME || ""; // Ini Username Wappin 2.0
    const wappinToken = process.env.WAPPIN_API_TOKEN || ""; // Ini Password Wappin 2.0
    
    if (!wappinClientName || !wappinToken) {
      return res.status(500).json({ error: 'Konfigurasi Wappin (Username/Password) di .env belum diset' });
    }

    const loginUrl = 'https://api.chat.wappin.app/v1/users/login';
    const basicAuth = Buffer.from(`${wappinClientName}:${wappinToken}`).toString('base64');
    
    let activeBearerToken = "";
    try {
      const tokenRes = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Authorization': `Basic ${basicAuth}` }
      });
      if (!tokenRes.ok) {
        const errJson = await tokenRes.json().catch(() => ({}));
        throw new Error(`Login Wappin 2.0 Gagal: ${errJson.errors?.[0]?.details || tokenRes.status}`);
      }
      const tokenData = await tokenRes.json();
      activeBearerToken = tokenData.users?.[0]?.token;
      if (!activeBearerToken) throw new Error("Token tidak ditemukan di response Wappin");
    } catch (e: any) {
      return res.status(500).json({ error: `Gagal otentikasi Wappin 2.0: ${e.message}` });
    }

    // 2. Ambil data tamu
    const targetGuests = await db.select().from(guests)
      .where(inArray(guests.id, guestIds));

    if (targetGuests.length === 0) {
      return res.status(404).json({ error: 'Guests not found' });
    }

    const results = [];
    
    for (const guest of targetGuests) {
      if (!guest.phone) {
        results.push({ guestId: guest.id, status: 'failed', error: 'No phone number' });
        continue;
      }

      // Ambil data event
      const eventResult = await db.select().from(events).where(eq(events.id, guest.eventId));
      const event = eventResult[0];

      if (!event || event.officeId !== officeId) {
        results.push({ guestId: guest.id, status: 'failed', error: 'Event not found or unauthorized' });
        continue;
      }

      let phoneStr = guest.phone.replace(/[^0-9]/g, '');
      if (phoneStr.startsWith('0')) phoneStr = '62' + phoneStr.slice(1);
      if (!phoneStr.startsWith('62')) phoneStr = '62' + phoneStr;
      
      // Wappin API expects number without '+'
      const recipientWaId = phoneStr;

      const envAppUrl = process.env.APP_URL || 'https://undangan.laznasdewandakwah.or.id';
      const appUrl = envAppUrl.includes('localhost') ? 'https://undangan.laznasdewandakwah.or.id' : envAppUrl;
      const rsvpUrl = `${appUrl}/rsvp/${guest.barcodeUid}`;
      
      // === AKALAN: FILE FISIK ===
      let fileUrl = '';
      try {
        const fs = require('fs');
        const path = require('path');
        const isProd = process.env.NODE_ENV === 'production';
        const staticDir = isProd ? path.join(process.cwd(), 'dist') : path.join(process.cwd(), 'public');
        const tempPdfDir = path.join(staticDir, 'wappin_pdf');
        
        if (!fs.existsSync(tempPdfDir)) {
          fs.mkdirSync(tempPdfDir, { recursive: true });
        }
        
        const pdfFilename = `${guest.barcodeUid}_${Date.now()}.pdf`;
        const physicalPdfPath = path.join(tempPdfDir, pdfFilename);
        
        // Extract base64
        const targetBase64 = guest.customInvitationFile || event.invitationFile || '';
        
        if (!targetBase64) {
          throw new Error('Tamu ini dan Event ini tidak memiliki file PDF undangan. Harap unggah PDF terlebih dahulu.');
        }

        const matches = targetBase64.match(/^data:(.+);base64,([\s\S]+)$/);
        
        if (matches && matches.length === 3) {
          fs.writeFileSync(physicalPdfPath, Buffer.from(matches[2], 'base64'));
          fileUrl = `${appUrl}/api/guests/download-physical-pdf/${pdfFilename}`;
        } else if (targetBase64.startsWith('http://') || targetBase64.startsWith('https://')) {
          fileUrl = targetBase64;
        } else {
          // Fallback if not valid base64 or URL
          fileUrl = guest.customInvitationFile 
            ? `${appUrl}/api/guests/public/invitation/${guest.barcodeUid}/undangan.pdf` 
            : `${appUrl}/api/events/public/invitation/${event.eventName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/undangan.pdf`;
        }
      } catch (err) {
        console.error('Error creating physical PDF:', err);
        // Fallback
        fileUrl = guest.customInvitationFile 
         ? `${appUrl}/api/guests/public/invitation/${guest.barcodeUid}/undangan.pdf` 
         : `${appUrl}/api/events/public/invitation/${event.eventName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/undangan.pdf`;
      }
      // === END AKALAN ===

      const eventDateStr = new Date(event.eventDate || '').toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const eventTimeStr = new Date(event.eventDate || '').toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' }).replace('.', ':');

      const documentFilename = `${guest.guestName}_Undangan`.replace(/[^a-zA-Z0-9]/g, '_');

      // Format Payload Wappin 2.0 dengan Header Dokumen
      const payload = {
        messaging_product: "whatsapp",
        to: recipientWaId,
        type: "template",
        template: {
          name: "undangan_dai",
          language: {
            policy: "deterministic",
            code: "id"
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "document",
                  document: {
                    link: fileUrl,
                    filename: documentFilename
                  }
                }
              ]
            },
            {
              type: "body",
              parameters: [
                { type: "text", text: (guest.guestName || "-").replace(/[\r\n]+/g, ' ') },
                { type: "text", text: (event.eventName || "Acara").replace(/[\r\n]+/g, ' ') },
                { type: "text", text: eventDateStr || "-" },
                { type: "text", text: eventTimeStr || "-" },
                { type: "text", text: (event.location || "-").replace(/[\r\n]+/g, ' ') },
                { type: "text", text: fileUrl },
                { type: "text", text: rsvpUrl }
              ]
            }
          ]
        }
      };

      try {
        const sendUrl = 'https://api.chat.wappin.app/v1/messages';
        
        const headers: any = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeBearerToken}`
        };
        if (process.env.WAPPIN_PROJECT_ID) {
          headers['Wappin-Project-Id'] = process.env.WAPPIN_PROJECT_ID;
        }

        const response = await fetch(sendUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const wappinError = await response.json().catch(() => ({}));
          throw new Error(wappinError.errors?.[0]?.details || wappinError.errors?.[0]?.title || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`[WAPPIN SUCCESS] Ke ${recipientWaId}:`, JSON.stringify(data));
        
        // Update DB (Dibungkus try-catch agar tidak error merah di PM2 jika lupa db:push)
        try {
          await db.update(guests).set({ wappinSent: true }).where(eq(guests.id, guest.id));
        } catch (dbErr: any) {
          console.warn('Wappin message sent, but failed to update DB (run db:push):', dbErr.message);
        }
        
        results.push({ guestId: guest.id, status: 'success', data });
      } catch (err: any) {
        console.error(`[WAPPIN FAILED] Ke ${recipientWaId}:`, err.message || String(err));
        results.push({ guestId: guest.id, status: 'failed', error: err.message || String(err) });
      }
      
      // Jeda 1.5 detik antar pengiriman supaya API Wappin tidak diam-diam membuang pesan (Rate Limit / Anti-Spam beruntun)
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    res.json({ success: true, results });
  } catch (error: any) {
    console.error('Wappin send error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

export default router;
