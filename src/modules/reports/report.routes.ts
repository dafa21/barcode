import { Router } from 'express';
import { db } from '../../db/index.ts';
import { events, guests, attendances } from '../../db/schema.ts';
import { eq, and, gte, lte, sql, inArray } from 'drizzle-orm';
import { jwtAuthGuard, AuthRequest } from '../../core/middlewares/jwtAuthGuard.ts';
import { tenantGuard } from '../../core/middlewares/tenantGuard.ts';

const router = Router();
router.use(jwtAuthGuard, tenantGuard);

// Analytics dashboard endpoint
router.get('/analytics', async (req: AuthRequest, res) => {
  try {
    const officeId = req.user?.officeId;
    if (!officeId) {
      return res.status(403).json({ error: 'Unauthorized: Office ID missing' });
    }

    const { startDate, endDate, eventId } = req.query;

    let eventFilter = eq(events.officeId, officeId);
    if (eventId) {
      eventFilter = and(eventFilter, eq(events.id, String(eventId))) as any;
    }
    if (startDate) {
      eventFilter = and(eventFilter, gte(events.eventDate, new Date(String(startDate)))) as any;
    }
    if (endDate) {
      // Set end date to end of day
      const end = new Date(String(endDate));
      end.setHours(23, 59, 59, 999);
      eventFilter = and(eventFilter, lte(events.eventDate, end)) as any;
    }

    // Fetch filtered events
    const filteredEvents = await db.select().from(events).where(eventFilter);
    const eventIds = filteredEvents.map(e => e.id);

    if (eventIds.length === 0) {
      return res.json({
        totalRegistered: 0,
        totalAttended: 0,
        attendanceRate: 0,
        eventsData: []
      });
    }

    // Fetch guests for these events
    const allGuests = await db.select().from(guests).where(inArray(guests.eventId, eventIds));
    
    // Fetch attendances for these events
    const allAttendances = await db.select().from(attendances).where(inArray(attendances.eventId, eventIds));

    const totalRegistered = allGuests.length;
    const totalAttended = allAttendances.filter(a => a.status === 'attended').length;
    const attendanceRate = totalRegistered > 0 ? (totalAttended / totalRegistered) * 100 : 0;

    // Aggregate by event
    const eventsData = filteredEvents.map(event => {
      const eventGuests = allGuests.filter(g => g.eventId === event.id).length;
      const eventAttended = allAttendances.filter(a => a.eventId === event.id && a.status === 'attended').length;
      
      return {
        id: event.id,
        name: event.eventName,
        date: event.eventDate,
        registered: eventGuests,
        attended: eventAttended,
        rate: eventGuests > 0 ? (eventAttended / eventGuests) * 100 : 0
      };
    });

    res.json({
      totalRegistered,
      totalAttended,
      attendanceRate,
      eventsData
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// CSV Export
router.get('/export/csv', async (req: AuthRequest, res) => {
  try {
    const officeId = req.user?.officeId;
    if (!officeId) {
      return res.status(403).json({ error: 'Unauthorized: Office ID missing' });
    }

    const { startDate, endDate, eventId } = req.query;

    let eventFilter = eq(events.officeId, officeId);
    if (eventId) {
      eventFilter = and(eventFilter, eq(events.id, String(eventId))) as any;
    }
    if (startDate) {
      eventFilter = and(eventFilter, gte(events.eventDate, new Date(String(startDate)))) as any;
    }
    if (endDate) {
      const end = new Date(String(endDate));
      end.setHours(23, 59, 59, 999);
      eventFilter = and(eventFilter, lte(events.eventDate, end)) as any;
    }

    const filteredEvents = await db.select().from(events).where(eventFilter);
    const eventIds = filteredEvents.map(e => e.id);

    if (eventIds.length === 0) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="report.csv"');
      return res.send('Event,Guest Name,Email,Status,Scanned At\n');
    }

    // Join guests, events, and attendances
    const reportData = await db
      .select({
        eventName: events.eventName,
        guestName: guests.guestName,
        email: guests.email,
        status: attendances.status,
        scannedAt: attendances.scannedAt
      })
      .from(guests)
      .innerJoin(events, eq(guests.eventId, events.id))
      .leftJoin(attendances, eq(guests.id, attendances.guestId))
      .where(inArray(events.id, eventIds));

    // Build CSV
    let csv = 'Event,Guest Name,Email,Status,Scanned At\n';
    reportData.forEach(row => {
      const status = row.status || 'Not Attended';
      const scannedAt = row.scannedAt ? new Date(row.scannedAt).toLocaleString() : 'N/A';
      csv += `"${row.eventName}","${row.guestName}","${row.email || ''}","${status}","${scannedAt}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="attendance_report.csv"');
    res.send(csv);

  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

export default router;
