import { Router } from 'express';
import { db } from '../../db/index.ts';
import { guests, attendances, events } from '../../db/schema.ts';
import { eq, and } from 'drizzle-orm';
import { jwtAuthGuard, AuthRequest } from '../../core/middlewares/jwtAuthGuard.ts';
import { tenantGuard } from '../../core/middlewares/tenantGuard.ts';

const router = Router();

router.post('/scan', jwtAuthGuard, tenantGuard, async (req: AuthRequest, res) => {
  try {
    const { barcodeUid, eventId } = req.body;
    const { officeId, role } = req.user!;

    if (!barcodeUid || !eventId) {
      return res.status(400).json({ error: 'barcodeUid and eventId are required' });
    }

    // Check if the event exists and belongs to the user's office (if not super_admin)
    const eventResult = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    if (eventResult.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    const event = eventResult[0];

    if (role === 'office_admin' && event.officeId !== officeId) {
      return res.status(403).json({ error: 'Forbidden: Event does not belong to your office' });
    }

    if (!event.isActive) {
      return res.status(400).json({ error: 'Event is no longer active' });
    }

    // Find the guest by barcodeUid
    const guestResult = await db.select().from(guests).where(eq(guests.barcodeUid, barcodeUid)).limit(1);
    if (guestResult.length === 0) {
      return res.status(404).json({ error: 'Guest not found / Invalid barcode' });
    }
    const guest = guestResult[0];

    // Check if guest belongs to this event
    if (guest.eventId !== eventId) {
      return res.status(400).json({ error: 'Guest is not registered for this event' });
    }

    // Check idempotency (prevent double scan)
    const existingAttendance = await db.select()
      .from(attendances)
      .where(and(eq(attendances.guestId, guest.id), eq(attendances.eventId, eventId)))
      .limit(1);

    if (existingAttendance.length > 0) {
      return res.status(400).json({ error: 'Guest has already been scanned for this event' });
    }

    // Record attendance
    const attendanceResult = await db.insert(attendances).values({
      guestId: guest.id,
      eventId: eventId,
      status: 'attended',
    }).returning();

    res.json({ message: 'Attendance recorded successfully', data: attendanceResult[0], guest });
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Internal server error', cause: error });
  }
});

export default router;
