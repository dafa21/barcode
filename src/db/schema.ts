import { relations } from 'drizzle-orm';
import { pgTable, varchar, timestamp, text, boolean, pgEnum, integer, uuid } from 'drizzle-orm/pg-core';

// Enums
export const roleEnum = pgEnum('role', ['super_admin', 'office_admin', 'pic']);

export const statusEnum = pgEnum('status', ['attended', 'invalid']);
export const rsvpEnum = pgEnum('rsvp_status', ['pending', 'attending', 'not_attending']);

// Tables
export const offices = pgTable('offices', {
  id: uuid('id').primaryKey().defaultRandom(),
  officeName: varchar('office_name', { length: 255 }).notNull(),
  contactEmail: varchar('contact_email', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  uid: text('uid').unique(), // Firebase Auth UID
  officeId: uuid('office_id').references(() => offices.id),
  username: varchar('username', { length: 50 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: roleEnum('role').notNull(),
});

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  officeId: uuid('office_id').references(() => offices.id).notNull(),
  eventName: varchar('event_name', { length: 255 }).notNull(),
  eventDate: timestamp('event_date').notNull(),
  location: text('location'),
  isActive: boolean('is_active').default(true),
  logo: text('logo'),
  twibbonBackground: text('twibbon_background'),
  twibbonConfig: text('twibbon_config'),
  invitationFile: text('invitation_file'),
  letterBackground: text('letter_background'),
  letterSize: varchar('letter_size', { length: 20 }).default('A4'),
  letterContent: text('letter_content'),
  backsound: text('backsound'),
  heroImage: text('hero_image'),
  gallery: text('gallery'),
  mapsLink: text('maps_link'),
  themePrimary: varchar('theme_primary', { length: 20 }).default('#b45309'), // amber-700
  themeSecondary: varchar('theme_secondary', { length: 20 }).default('#fef3c7'), // amber-50
  openingQuote: text('opening_quote'),
  eventEndDate: timestamp('event_end_date'),
  rundown: text('rundown'),
});

export const guests = pgTable('guests', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id).notNull(),
  picId: uuid('pic_id').references(() => users.id), // New PIC relation
  guestName: varchar('guest_name', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }),
  jobTitle: varchar('job_title', { length: 255 }),
  email: varchar('email', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  barcodeUid: varchar('barcode_uid', { length: 100 }).notNull().unique(), // UUID for barcode
  rsvpStatus: rsvpEnum('rsvp_status').default('pending'),
  isVip: boolean('is_vip').default(false),
  paxCount: integer('pax_count').default(1),
  customInvitationFile: text('custom_invitation_file'),
});

export const attendances = pgTable('attendances', {
  id: uuid('id').primaryKey().defaultRandom(),
  guestId: uuid('guest_id').references(() => guests.id).notNull(),
  eventId: uuid('event_id').references(() => events.id).notNull(),
  scannedAt: timestamp('scanned_at').defaultNow(),
  status: statusEnum('status').default('attended'),
});

// Relations
export const officesRelations = relations(offices, ({ many }) => ({
  users: many(users),
  events: many(events),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  office: one(offices, {
    fields: [users.officeId],
    references: [offices.id],
  }),
  guests: many(guests),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  office: one(offices, {
    fields: [events.officeId],
    references: [offices.id],
  }),
  guests: many(guests),
  attendances: many(attendances),
}));

export const guestsRelations = relations(guests, ({ one, many }) => ({
  event: one(events, {
    fields: [guests.eventId],
    references: [events.id],
  }),
  pic: one(users, {
    fields: [guests.picId],
    references: [users.id],
  }),
  attendances: many(attendances),
}));

export const attendancesRelations = relations(attendances, ({ one }) => ({
  guest: one(guests, {
    fields: [attendances.guestId],
    references: [guests.id],
  }),
  event: one(events, {
    fields: [attendances.eventId],
    references: [events.id],
  }),
}));
