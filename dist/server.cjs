var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_config = require("dotenv/config");
var import_express9 = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");

// src/modules/auth/auth.routes.ts
var import_express = require("express");
var import_bcrypt = __toESM(require("bcrypt"), 1);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);

// src/db/index.ts
var import_node_postgres = require("drizzle-orm/node-postgres");
var import_pg = require("pg");

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  attendances: () => attendances,
  attendancesRelations: () => attendancesRelations,
  events: () => events,
  eventsRelations: () => eventsRelations,
  guests: () => guests,
  guestsRelations: () => guestsRelations,
  offices: () => offices,
  officesRelations: () => officesRelations,
  roleEnum: () => roleEnum,
  rsvpEnum: () => rsvpEnum,
  statusEnum: () => statusEnum,
  users: () => users,
  usersRelations: () => usersRelations
});
var import_drizzle_orm = require("drizzle-orm");
var import_pg_core = require("drizzle-orm/pg-core");
var roleEnum = (0, import_pg_core.pgEnum)("role", ["super_admin", "office_admin", "pic"]);
var statusEnum = (0, import_pg_core.pgEnum)("status", ["attended", "invalid"]);
var rsvpEnum = (0, import_pg_core.pgEnum)("rsvp_status", ["pending", "attending", "not_attending"]);
var offices = (0, import_pg_core.pgTable)("offices", {
  id: (0, import_pg_core.uuid)("id").primaryKey().defaultRandom(),
  officeName: (0, import_pg_core.varchar)("office_name", { length: 255 }).notNull(),
  contactEmail: (0, import_pg_core.varchar)("contact_email", { length: 100 }),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var users = (0, import_pg_core.pgTable)("users", {
  id: (0, import_pg_core.uuid)("id").primaryKey().defaultRandom(),
  uid: (0, import_pg_core.text)("uid").unique(),
  // Firebase Auth UID
  officeId: (0, import_pg_core.uuid)("office_id").references(() => offices.id),
  username: (0, import_pg_core.varchar)("username", { length: 50 }).notNull().unique(),
  passwordHash: (0, import_pg_core.varchar)("password_hash", { length: 255 }).notNull(),
  role: roleEnum("role").notNull()
});
var events = (0, import_pg_core.pgTable)("events", {
  id: (0, import_pg_core.uuid)("id").primaryKey().defaultRandom(),
  officeId: (0, import_pg_core.uuid)("office_id").references(() => offices.id).notNull(),
  eventName: (0, import_pg_core.varchar)("event_name", { length: 255 }).notNull(),
  eventDate: (0, import_pg_core.timestamp)("event_date").notNull(),
  location: (0, import_pg_core.text)("location"),
  isActive: (0, import_pg_core.boolean)("is_active").default(true),
  logo: (0, import_pg_core.text)("logo"),
  twibbonBackground: (0, import_pg_core.text)("twibbon_background"),
  twibbonConfig: (0, import_pg_core.text)("twibbon_config"),
  invitationFile: (0, import_pg_core.text)("invitation_file"),
  letterBackground: (0, import_pg_core.text)("letter_background"),
  letterSize: (0, import_pg_core.varchar)("letter_size", { length: 20 }).default("A4"),
  letterContent: (0, import_pg_core.text)("letter_content"),
  backsound: (0, import_pg_core.text)("backsound"),
  heroImage: (0, import_pg_core.text)("hero_image"),
  gallery: (0, import_pg_core.text)("gallery"),
  mapsLink: (0, import_pg_core.text)("maps_link"),
  themePrimary: (0, import_pg_core.varchar)("theme_primary", { length: 20 }).default("#b45309"),
  // amber-700
  themeSecondary: (0, import_pg_core.varchar)("theme_secondary", { length: 20 }).default("#fef3c7"),
  // amber-50
  openingQuote: (0, import_pg_core.text)("opening_quote"),
  eventEndDate: (0, import_pg_core.timestamp)("event_end_date"),
  rundown: (0, import_pg_core.text)("rundown"),
  socialWebsite: (0, import_pg_core.text)("social_website"),
  socialYoutube: (0, import_pg_core.text)("social_youtube"),
  socialInstagram: (0, import_pg_core.text)("social_instagram")
});
var guests = (0, import_pg_core.pgTable)("guests", {
  id: (0, import_pg_core.uuid)("id").primaryKey().defaultRandom(),
  eventId: (0, import_pg_core.uuid)("event_id").references(() => events.id).notNull(),
  picId: (0, import_pg_core.uuid)("pic_id").references(() => users.id),
  // New PIC relation
  guestName: (0, import_pg_core.varchar)("guest_name", { length: 255 }).notNull(),
  company: (0, import_pg_core.varchar)("company", { length: 255 }),
  jobTitle: (0, import_pg_core.varchar)("job_title", { length: 255 }),
  guestType: (0, import_pg_core.varchar)("guest_type", { length: 100 }),
  // Kementrian, Pejabat/Tokoh Publik, Dewan Dakwah, dll
  email: (0, import_pg_core.varchar)("email", { length: 100 }),
  phone: (0, import_pg_core.varchar)("phone", { length: 20 }),
  barcodeUid: (0, import_pg_core.varchar)("barcode_uid", { length: 100 }).notNull().unique(),
  // UUID for barcode
  rsvpStatus: rsvpEnum("rsvp_status").default("pending"),
  isVip: (0, import_pg_core.boolean)("is_vip").default(false),
  paxCount: (0, import_pg_core.integer)("pax_count").default(1),
  customInvitationFile: (0, import_pg_core.text)("custom_invitation_file"),
  wappinSent: (0, import_pg_core.boolean)("wappin_sent").default(false),
  manualWaSent: (0, import_pg_core.boolean)("manual_wa_sent").default(false)
});
var attendances = (0, import_pg_core.pgTable)("attendances", {
  id: (0, import_pg_core.uuid)("id").primaryKey().defaultRandom(),
  guestId: (0, import_pg_core.uuid)("guest_id").references(() => guests.id).notNull(),
  eventId: (0, import_pg_core.uuid)("event_id").references(() => events.id).notNull(),
  scannedAt: (0, import_pg_core.timestamp)("scanned_at").defaultNow(),
  status: statusEnum("status").default("attended")
});
var officesRelations = (0, import_drizzle_orm.relations)(offices, ({ many }) => ({
  users: many(users),
  events: many(events)
}));
var usersRelations = (0, import_drizzle_orm.relations)(users, ({ one, many }) => ({
  office: one(offices, {
    fields: [users.officeId],
    references: [offices.id]
  }),
  guests: many(guests)
}));
var eventsRelations = (0, import_drizzle_orm.relations)(events, ({ one, many }) => ({
  office: one(offices, {
    fields: [events.officeId],
    references: [offices.id]
  }),
  guests: many(guests),
  attendances: many(attendances)
}));
var guestsRelations = (0, import_drizzle_orm.relations)(guests, ({ one, many }) => ({
  event: one(events, {
    fields: [guests.eventId],
    references: [events.id]
  }),
  pic: one(users, {
    fields: [guests.picId],
    references: [users.id]
  }),
  attendances: many(attendances)
}));
var attendancesRelations = (0, import_drizzle_orm.relations)(attendances, ({ one }) => ({
  guest: one(guests, {
    fields: [attendances.guestId],
    references: [guests.id]
  }),
  event: one(events, {
    fields: [attendances.eventId],
    references: [events.id]
  })
}));

// src/db/index.ts
var createPool = () => {
  if (process.env.DATABASE_URL) {
    return new import_pg.Pool({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 15e3
    });
  }
  return new import_pg.Pool({
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT ? parseInt(process.env.SQL_PORT) : 5432,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME,
    connectionTimeoutMillis: 15e3
  });
};
var pool = createPool();
pool.on("error", (err) => {
  console.error("Unexpected error on idle SQL pool client:", err);
});
var db = (0, import_node_postgres.drizzle)(pool, { schema: schema_exports });

// src/modules/auth/auth.routes.ts
var import_drizzle_orm2 = require("drizzle-orm");
var router = (0, import_express.Router)();
var JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-dev";
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }
    const userResult = await db.select().from(users).where((0, import_drizzle_orm2.eq)(users.username, username)).limit(1);
    if (userResult.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = userResult[0];
    const passwordMatch = await import_bcrypt.default.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = import_jsonwebtoken.default.sign(
      { id: user.id, officeId: user.officeId, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token, user: { id: user.id, username: user.username, role: user.role, officeId: user.officeId } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/register-super-admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await db.select().from(users).where((0, import_drizzle_orm2.eq)(users.username, username)).limit(1);
    if (existing.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hash = await import_bcrypt.default.hash(password, 10);
    const result = await db.insert(users).values({
      username,
      passwordHash: hash,
      role: "super_admin"
    }).returning();
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", cause: error });
  }
});
var auth_routes_default = router;
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    const decoded = import_jsonwebtoken.default.verify(token, JWT_SECRET);
    res.json(decoded);
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// src/modules/offices/office.routes.ts
var import_express2 = require("express");
var import_drizzle_orm3 = require("drizzle-orm");

// src/core/middlewares/jwtAuthGuard.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
var JWT_SECRET2 = process.env.JWT_SECRET || "super-secret-key-for-dev";
var jwtAuthGuard = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    const decoded = import_jsonwebtoken2.default.verify(token, JWT_SECRET2);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name !== "TokenExpiredError") {
      console.error("Error verifying JWT token:", error);
    }
    return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

// src/modules/offices/office.routes.ts
var import_bcrypt2 = __toESM(require("bcrypt"), 1);
var router2 = (0, import_express2.Router)();
var requireSuperAdmin = (req, res, next) => {
  if (req.user?.role !== "super_admin") {
    return res.status(403).json({ error: "Forbidden: Super Admin only" });
  }
  next();
};
router2.use(jwtAuthGuard, requireSuperAdmin);
router2.post("/", async (req, res) => {
  try {
    const { officeName, contactEmail } = req.body;
    const result = await db.insert(offices).values({ officeName, contactEmail }).returning();
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", cause: error });
  }
});
router2.get("/", async (req, res) => {
  try {
    const allOffices = await db.select().from(offices);
    res.json(allOffices);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", cause: error });
  }
});
router2.post("/:officeId/admins", async (req, res) => {
  try {
    const { officeId } = req.params;
    const { username, password } = req.body;
    const existing = await db.select().from(users).where((0, import_drizzle_orm3.eq)(users.username, username)).limit(1);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const hash = await import_bcrypt2.default.hash(password, 10);
    const result = await db.insert(users).values({
      officeId,
      username,
      passwordHash: hash,
      role: "office_admin"
    }).returning();
    const { passwordHash, ...safeUser } = result[0];
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", cause: error });
  }
});
var office_routes_default = router2;

// src/modules/events/event.routes.ts
var import_express3 = require("express");
var import_drizzle_orm4 = require("drizzle-orm");

// src/core/middlewares/tenantGuard.ts
var tenantGuard = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: User not authenticated" });
  }
  if (req.user.role === "super_admin") {
    return next();
  }
  const { officeId } = req.user;
  if (!officeId) {
    return res.status(403).json({ error: "Forbidden: No office assigned to user" });
  }
  next();
};

// src/modules/events/event.routes.ts
var router3 = (0, import_express3.Router)();
router3.get("/public/image/:id/:field", async (req, res) => {
  try {
    const { id, field } = req.params;
    const allowedFields = ["logo", "twibbonBackground", "heroImage", "letterBackground"];
    if (!allowedFields.includes(field)) return res.status(400).send("Invalid field");
    const result = await db.select({
      [field]: events[field]
    }).from(events).where((0, import_drizzle_orm4.eq)(events.id, id)).limit(1);
    if (result.length === 0 || !result[0][field]) return res.status(404).send("Not found");
    const base64Str = result[0][field];
    const matches = base64Str.match(/^data:(.+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      res.setHeader("Content-Type", matches[1]);
      res.setHeader("Cache-Control", "public, max-age=31536000");
      return res.send(Buffer.from(matches[2], "base64"));
    }
    return res.send(base64Str);
  } catch (error) {
    res.status(500).send("Error");
  }
});
router3.get("/public/gallery/:id/:index", async (req, res) => {
  try {
    const { id, index } = req.params;
    const result = await db.select({ gallery: events.gallery }).from(events).where((0, import_drizzle_orm4.eq)(events.id, id)).limit(1);
    if (result.length === 0 || !result[0].gallery) return res.status(404).send("Not found");
    const galleryArr = JSON.parse(result[0].gallery);
    const idx = parseInt(index);
    if (isNaN(idx) || idx < 0 || idx >= galleryArr.length) return res.status(404).send("Not found");
    const base64Str = galleryArr[idx];
    const matches = base64Str.match(/^data:(.+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      res.setHeader("Content-Type", matches[1]);
      res.setHeader("Cache-Control", "public, max-age=31536000");
      return res.send(Buffer.from(matches[2], "base64"));
    }
    return res.send(base64Str);
  } catch (error) {
    res.status(500).send("Error");
  }
});
var handleEventInvitation = async (req, res) => {
  try {
    let { slug } = req.params;
    if (slug.endsWith("/undangan.pdf")) slug = slug.replace("/undangan.pdf", "");
    const allEventsLight = await db.select({
      id: events.id,
      eventName: events.eventName
    }).from(events);
    const matchedEvent = allEventsLight.find(
      (e) => e.eventName.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
    );
    if (!matchedEvent) {
      return res.status(404).send("Undangan tidak ditemukan");
    }
    const eventResult = await db.select({
      eventName: events.eventName,
      invitationFile: events.invitationFile
    }).from(events).where((0, import_drizzle_orm4.eq)(events.id, matchedEvent.id)).limit(1);
    const event = eventResult[0];
    if (!event || !event.invitationFile) {
      return res.status(404).send("File undangan belum diunggah untuk acara ini");
    }
    const matches = event.invitationFile.match(/^data:(.+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");
      res.setHeader("Content-Type", mimeType || "application/pdf");
      res.setHeader("Content-Length", buffer.length);
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.setHeader("Content-Disposition", `attachment; filename="${event.eventName.replace(/[^a-zA-Z0-9]/g, "_")}_Undangan.pdf"`);
      return res.end(buffer);
    } else {
      return res.send(event.invitationFile);
    }
  } catch (error) {
    console.error("Error fetching event invitation file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
router3.get("/public/invitation/:slug/undangan.pdf", handleEventInvitation);
router3.get("/public/invitation/:slug([^/]+(?:/undangan\\.pdf)?)", handleEventInvitation);
router3.get("/public/invitation/:slug", handleEventInvitation);
router3.use(jwtAuthGuard, tenantGuard);
router3.post("/", async (req, res) => {
  try {
    const {
      eventName,
      eventDate,
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
      eventEndDate,
      rundown,
      socialWebsite,
      socialYoutube,
      socialInstagram
    } = req.body;
    let targetOfficeId = req.user.officeId;
    if (req.user.role === "super_admin") {
      targetOfficeId = req.body.officeId;
      if (!targetOfficeId) {
        return res.status(400).json({ error: "officeId is required for super_admin" });
      }
    }
    const result = await db.insert(events).values({
      officeId: targetOfficeId,
      eventName,
      eventDate: new Date(eventDate),
      location,
      mapsLink,
      isActive: isActive !== void 0 ? isActive : true,
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
      socialInstagram
    }).returning();
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", cause: error });
  }
});
router3.get("/", async (req, res) => {
  try {
    const { role, officeId } = req.user;
    let userEvents;
    const lightSelect = {
      id: events.id,
      officeId: events.officeId,
      eventName: events.eventName,
      eventDate: events.eventDate,
      location: events.location,
      isActive: events.isActive
    };
    if (role === "super_admin") {
      userEvents = await db.select(lightSelect).from(events);
    } else {
      userEvents = await db.select(lightSelect).from(events).where((0, import_drizzle_orm4.eq)(events.officeId, officeId));
    }
    res.json(userEvents);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", cause: error });
  }
});
router3.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role, officeId } = req.user;
    const eventResult = await db.select().from(events).where((0, import_drizzle_orm4.eq)(events.id, id));
    if (eventResult.length === 0) return res.status(404).json({ error: "Event not found" });
    if (role !== "super_admin" && eventResult[0].officeId !== officeId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    res.json(eventResult[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
router3.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      eventName,
      eventDate,
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
      eventEndDate,
      rundown,
      socialWebsite,
      socialYoutube,
      socialInstagram
    } = req.body;
    const { role, officeId } = req.user;
    const event = await db.select().from(events).where((0, import_drizzle_orm4.eq)(events.id, id));
    if (event.length === 0) return res.status(404).json({ error: "Event not found" });
    if (role !== "super_admin" && event[0].officeId !== officeId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const updated = await db.update(events).set({
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
      socialInstagram
    }).where((0, import_drizzle_orm4.eq)(events.id, id)).returning();
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
router3.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role, officeId } = req.user;
    const event = await db.select().from(events).where((0, import_drizzle_orm4.eq)(events.id, id));
    if (event.length === 0) return res.status(404).json({ error: "Event not found" });
    if (role !== "super_admin" && event[0].officeId !== officeId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    await db.delete(attendances).where((0, import_drizzle_orm4.eq)(attendances.eventId, id));
    await db.delete(guests).where((0, import_drizzle_orm4.eq)(guests.eventId, id));
    await db.delete(events).where((0, import_drizzle_orm4.eq)(events.id, id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
var event_routes_default = router3;

// src/modules/guests/guest.routes.ts
var import_express4 = require("express");
var fs = __toESM(require("fs"), 1);
var path = __toESM(require("path"), 1);
var import_drizzle_orm5 = require("drizzle-orm");
var import_uuid = require("uuid");
var router4 = (0, import_express4.Router)();
router4.get("/rsvp/:barcodeUid", async (req, res) => {
  try {
    const { barcodeUid } = req.params;
    const guestResult = await db.select({
      id: guests.id,
      guestName: guests.guestName,
      company: guests.company,
      jobTitle: guests.jobTitle,
      rsvpStatus: guests.rsvpStatus,
      paxCount: guests.paxCount,
      customInvitationFile: import_drizzle_orm5.sql`CASE WHEN ${guests.customInvitationFile} IS NOT NULL THEN 'exists' ELSE NULL END`.as("customInvitationFile"),
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
    }).from(guests).leftJoin(events, (0, import_drizzle_orm5.eq)(guests.eventId, events.id)).where((0, import_drizzle_orm5.eq)(guests.barcodeUid, barcodeUid)).limit(1);
    if (guestResult.length === 0) {
      return res.status(404).json({ error: "Guest not found" });
    }
    const guest = guestResult[0];
    if (guest.event) {
      const e = guest.event;
      const getUrl = (field) => `/api/events/public/image/${e.id}/${field}`;
      if (e.logo && e.logo.startsWith("data:image")) e.logo = getUrl("logo");
      if (e.heroImage && e.heroImage.startsWith("data:image")) e.heroImage = getUrl("heroImage");
      if (e.twibbonBackground && e.twibbonBackground.startsWith("data:image")) e.twibbonBackground = getUrl("twibbonBackground");
      if (e.letterBackground && e.letterBackground.startsWith("data:image")) e.letterBackground = getUrl("letterBackground");
      if (e.gallery) {
        try {
          const galleryArr = JSON.parse(e.gallery);
          const newGallery = galleryArr.map(
            (img, index) => img.startsWith("data:image") ? `/api/events/public/gallery/${e.id}/${index}` : img
          );
          e.gallery = JSON.stringify(newGallery);
        } catch (err) {
        }
      }
    }
    res.json(guest);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", cause: error });
  }
});
router4.post("/rsvp/:barcodeUid", async (req, res) => {
  try {
    const { barcodeUid } = req.params;
    const { rsvpStatus, paxCount, additionalGuests } = req.body;
    const guestResult = await db.select().from(guests).where((0, import_drizzle_orm5.eq)(guests.barcodeUid, barcodeUid)).limit(1);
    if (guestResult.length === 0) {
      return res.status(404).json({ error: "Guest not found" });
    }
    const mainGuest = guestResult[0];
    const updated = await db.update(guests).set({
      rsvpStatus: rsvpStatus || "attending",
      paxCount: paxCount || 1
    }).where((0, import_drizzle_orm5.eq)(guests.barcodeUid, barcodeUid)).returning();
    if (rsvpStatus === "attending" && paxCount > 1 && Array.isArray(additionalGuests) && additionalGuests.length > 0) {
      const newGuests = additionalGuests.map((ag) => ({
        eventId: mainGuest.eventId,
        picId: mainGuest.picId,
        company: mainGuest.company,
        guestName: ag.guestName,
        phone: ag.phone,
        jobTitle: ag.jobTitle || null,
        barcodeUid: (0, import_uuid.v4)(),
        rsvpStatus: "attending",
        paxCount: 1
      }));
      if (newGuests.length > 0) {
        await db.insert(guests).values(newGuests);
      }
    }
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", cause: error });
  }
});
var handleGuestInvitation = async (req, res) => {
  try {
    let { barcodeUid } = req.params;
    if (barcodeUid.endsWith("/undangan.pdf")) barcodeUid = barcodeUid.replace("/undangan.pdf", "");
    const guestResult = await db.select({
      customInvitationFile: guests.customInvitationFile,
      guestName: guests.guestName
    }).from(guests).where((0, import_drizzle_orm5.eq)(guests.barcodeUid, barcodeUid)).limit(1);
    const guest = guestResult[0];
    if (!guest || !guest.customInvitationFile) {
      return res.status(404).send("File undangan khusus tidak ditemukan untuk tamu ini");
    }
    const matches = guest.customInvitationFile.match(/^data:(.+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");
      res.setHeader("Content-Type", mimeType || "application/pdf");
      res.setHeader("Content-Length", buffer.length);
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.setHeader("Content-Disposition", `attachment; filename="${guest.guestName.replace(/[^a-zA-Z0-9]/g, "_")}_Undangan.pdf"`);
      return res.end(buffer);
    } else {
      return res.send(guest.customInvitationFile);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
router4.get("/public/invitation/:barcodeUid/undangan.pdf", handleGuestInvitation);
router4.get("/public/invitation/:barcodeUid([^/]+(?:/undangan\\.pdf)?)", handleGuestInvitation);
router4.get("/public/invitation/:barcodeUid", handleGuestInvitation);
router4.use(jwtAuthGuard, tenantGuard);
router4.post("/", async (req, res) => {
  try {
    const { eventId, guestName, email, phone, company, jobTitle, guestType, picId, isVip, customInvitationFile } = req.body;
    const eventResult = await db.select().from(events).where((0, import_drizzle_orm5.eq)(events.id, eventId)).limit(1);
    if (eventResult.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    if ((req.user.role === "office_admin" || req.user.role === "pic") && eventResult[0].officeId !== req.user.officeId) {
      return res.status(403).json({ error: "Forbidden: Event does not belong to your office" });
    }
    const barcodeUid = (0, import_uuid.v4)();
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
      customInvitationFile
    }).returning();
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", cause: error });
  }
});
router4.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { guestName, email, phone, company, jobTitle, guestType, picId, isVip, customInvitationFile } = req.body;
    const guestResult = await db.select().from(guests).where((0, import_drizzle_orm5.eq)(guests.id, id)).limit(1);
    if (guestResult.length === 0) {
      return res.status(404).json({ error: "Guest not found" });
    }
    const eventResult = await db.select().from(events).where((0, import_drizzle_orm5.eq)(events.id, guestResult[0].eventId)).limit(1);
    if (eventResult.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    if ((req.user.role === "office_admin" || req.user.role === "pic") && eventResult[0].officeId !== req.user.officeId) {
      return res.status(403).json({ error: "Forbidden: Event does not belong to your office" });
    }
    const updated = await db.update(guests).set({
      guestName,
      email: email || null,
      phone: phone || null,
      company: company || null,
      jobTitle: jobTitle || null,
      guestType: guestType || null,
      picId: picId || null,
      isVip: isVip !== void 0 ? !!isVip : guestResult[0].isVip,
      customInvitationFile: customInvitationFile !== void 0 ? customInvitationFile : guestResult[0].customInvitationFile
    }).where((0, import_drizzle_orm5.eq)(guests.id, id)).returning();
    res.json(updated[0]);
  } catch (error) {
    console.error("Update guest error:", error);
    res.status(500).json({ error: "Internal server error", cause: error });
  }
});
router4.get("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const eventResult = await db.select().from(events).where((0, import_drizzle_orm5.eq)(events.id, eventId)).limit(1);
    if (eventResult.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    if ((req.user.role === "office_admin" || req.user.role === "pic") && eventResult[0].officeId !== req.user.officeId) {
      return res.status(403).json({ error: "Forbidden: Event does not belong to your office" });
    }
    const eventGuests = await db.select({
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
      customInvitationFile: import_drizzle_orm5.sql`CASE WHEN ${guests.customInvitationFile} IS NOT NULL THEN 'exists' ELSE NULL END`.as("customInvitationFile"),
      status: attendances.status,
      scannedAt: attendances.scannedAt
    }).from(guests).leftJoin(attendances, (0, import_drizzle_orm5.eq)(guests.id, attendances.guestId)).leftJoin(users, (0, import_drizzle_orm5.eq)(guests.picId, users.id)).where((0, import_drizzle_orm5.eq)(guests.eventId, eventId));
    res.json(eventGuests);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", cause: error });
  }
});
router4.post("/bulk", jwtAuthGuard, tenantGuard, async (req, res) => {
  try {
    const { guests: newGuests } = req.body;
    if (!Array.isArray(newGuests) || newGuests.length === 0) {
      return res.status(400).json({ error: "Invalid guests data" });
    }
    const { officeId, role } = req.user;
    const eventId = newGuests[0].eventId;
    const eventResult = await db.select().from(events).where((0, import_drizzle_orm5.eq)(events.id, eventId)).limit(1);
    if (eventResult.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    if (role === "office_admin" && eventResult[0].officeId !== officeId) {
      return res.status(403).json({ error: "Forbidden: Event does not belong to your office" });
    }
    const values = newGuests.map((g) => ({
      eventId: g.eventId,
      guestName: g.guestName,
      email: g.email || null,
      phone: g.phone || null,
      company: g.company || null,
      jobTitle: g.jobTitle || null,
      guestType: g.guestType || null,
      picId: g.picId || null,
      isVip: !!g.isVip,
      barcodeUid: (0, import_uuid.v4)()
    }));
    const result = await db.insert(guests).values(values).returning();
    res.json(result);
  } catch (error) {
    console.error("Bulk insert error:", error);
    res.status(500).json({ error: "Internal server error", cause: error });
  }
});
router4.put("/bulk-update/excel", jwtAuthGuard, tenantGuard, async (req, res) => {
  try {
    const { updates } = req.body;
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: "Invalid updates data" });
    }
    const { officeId, role } = req.user;
    const results = [];
    for (const updateData of updates) {
      if (!updateData.barcodeUid) continue;
      const guestResult = await db.select().from(guests).where((0, import_drizzle_orm5.eq)(guests.barcodeUid, updateData.barcodeUid)).limit(1);
      if (guestResult.length === 0) continue;
      const eventResult = await db.select().from(events).where((0, import_drizzle_orm5.eq)(events.id, guestResult[0].eventId)).limit(1);
      if (eventResult.length === 0 || role === "office_admin" && eventResult[0].officeId !== officeId) {
        continue;
      }
      const updated = await db.update(guests).set({
        guestName: updateData.guestName !== void 0 ? updateData.guestName : guestResult[0].guestName,
        email: updateData.email !== void 0 ? updateData.email : guestResult[0].email,
        phone: updateData.phone !== void 0 ? updateData.phone : guestResult[0].phone,
        company: updateData.company !== void 0 ? updateData.company : guestResult[0].company,
        jobTitle: updateData.jobTitle !== void 0 ? updateData.jobTitle : guestResult[0].jobTitle,
        guestType: updateData.guestType !== void 0 ? updateData.guestType : guestResult[0].guestType,
        isVip: updateData.isVip !== void 0 ? updateData.isVip : guestResult[0].isVip
      }).where((0, import_drizzle_orm5.eq)(guests.barcodeUid, updateData.barcodeUid)).returning();
      if (updated.length > 0) results.push(updated[0]);
    }
    res.json({ updated: results.length });
  } catch (error) {
    console.error("Bulk update error:", error);
    res.status(500).json({ error: "Internal server error", cause: error });
  }
});
router4.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const guestResult = await db.select().from(guests).where((0, import_drizzle_orm5.eq)(guests.id, id)).limit(1);
    if (guestResult.length === 0) {
      return res.status(404).json({ error: "Guest not found" });
    }
    const eventResult = await db.select().from(events).where((0, import_drizzle_orm5.eq)(events.id, guestResult[0].eventId)).limit(1);
    if (eventResult.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    if ((req.user.role === "office_admin" || req.user.role === "pic") && eventResult[0].officeId !== req.user.officeId) {
      return res.status(403).json({ error: "Forbidden: Event does not belong to your office" });
    }
    await db.delete(attendances).where((0, import_drizzle_orm5.eq)(attendances.guestId, id));
    await db.delete(guests).where((0, import_drizzle_orm5.eq)(guests.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error("Delete guest error:", error);
    res.status(500).json({ error: "Internal server error", cause: error });
  }
});
router4.get("/wappin-config", jwtAuthGuard, tenantGuard, (req, res) => {
  res.json({
    wappinUrl: process.env.WAPPIN_API_URL ? process.env.WAPPIN_API_URL.replace(/["']/g, "") : "https://api.chat.wappin.app/v1/messages",
    wappinToken: process.env.WAPPIN_API_TOKEN,
    wappinClientName: process.env.WAPPIN_CLIENT_NAME,
    wappinProjectId: process.env.WAPPIN_PROJECT_ID,
    wappinSenderId: process.env.WAPPIN_SENDER_ID,
    appUrl: process.env.APP_URL || "http://localhost:3000"
  });
});
router4.post("/mark-manual-wa", jwtAuthGuard, tenantGuard, async (req, res) => {
  try {
    const { guestIds } = req.body;
    if (!guestIds || !Array.isArray(guestIds)) {
      return res.status(400).json({ error: "guestIds must be an array" });
    }
    const { officeId } = req.user;
    const targetGuests = await db.select().from(guests).where((0, import_drizzle_orm5.inArray)(guests.id, guestIds));
    if (targetGuests.length === 0) return res.status(404).json({ error: "Guests not found" });
    await db.update(guests).set({ manualWaSent: true }).where((0, import_drizzle_orm5.inArray)(guests.id, guestIds));
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error("Mark manual WA error:", error);
    res.status(500).json({ error: "Internal server error", cause: error });
  }
});
router4.get("/download-physical-pdf/:filename", (req, res) => {
  const filename = req.params.filename;
  const candidatePaths = [
    path.join(process.cwd(), "dist", "wappin_pdf", filename),
    path.join(process.cwd(), "public", "wappin_pdf", filename),
    path.join(process.cwd(), "wappin_pdf", filename)
  ];
  const foundPath = candidatePaths.find((p) => fs.existsSync(p));
  if (foundPath) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.sendFile(foundPath);
  } else {
    res.status(404).send("PDF not found di physical drive");
  }
});
router4.post("/send-wappin", jwtAuthGuard, tenantGuard, async (req, res) => {
  try {
    const { guestIds } = req.body;
    if (!guestIds || !Array.isArray(guestIds)) {
      return res.status(400).json({ error: "guestIds must be an array" });
    }
    const { officeId } = req.user;
    const wappinClientName = process.env.WAPPIN_CLIENT_NAME || "";
    const wappinToken = process.env.WAPPIN_API_TOKEN || "";
    if (!wappinClientName || !wappinToken) {
      return res.status(500).json({ error: "Konfigurasi Wappin (Username/Password) di .env belum diset" });
    }
    const loginUrl = "https://api.chat.wappin.app/v1/users/login";
    const basicAuth = Buffer.from(`${wappinClientName}:${wappinToken}`).toString("base64");
    let activeBearerToken = "";
    try {
      const tokenRes = await fetch(loginUrl, {
        method: "POST",
        headers: { "Authorization": `Basic ${basicAuth}` }
      });
      if (!tokenRes.ok) {
        const errJson = await tokenRes.json().catch(() => ({}));
        throw new Error(`Login Wappin 2.0 Gagal: ${errJson.errors?.[0]?.details || tokenRes.status}`);
      }
      const tokenData = await tokenRes.json();
      activeBearerToken = tokenData.users?.[0]?.token;
      if (!activeBearerToken) throw new Error("Token tidak ditemukan di response Wappin");
    } catch (e) {
      return res.status(500).json({ error: `Gagal otentikasi Wappin 2.0: ${e.message}` });
    }
    const targetGuests = await db.select().from(guests).where((0, import_drizzle_orm5.inArray)(guests.id, guestIds));
    if (targetGuests.length === 0) {
      return res.status(404).json({ error: "Guests not found" });
    }
    const results = [];
    for (const guest of targetGuests) {
      if (!guest.phone) {
        results.push({ guestId: guest.id, status: "failed", error: "No phone number" });
        continue;
      }
      const eventResult = await db.select().from(events).where((0, import_drizzle_orm5.eq)(events.id, guest.eventId));
      const event = eventResult[0];
      if (!event || event.officeId !== officeId) {
        results.push({ guestId: guest.id, status: "failed", error: "Event not found or unauthorized" });
        continue;
      }
      let phoneStr = guest.phone.replace(/[^0-9]/g, "");
      if (phoneStr.startsWith("0")) phoneStr = "62" + phoneStr.slice(1);
      if (!phoneStr.startsWith("62")) phoneStr = "62" + phoneStr;
      const recipientWaId = phoneStr;
      const envAppUrl = process.env.APP_URL || "https://undangan.laznasdewandakwah.or.id";
      const appUrl = envAppUrl.includes("localhost") ? "https://undangan.laznasdewandakwah.or.id" : envAppUrl;
      const rsvpUrl = `${appUrl}/rsvp/${guest.barcodeUid}`;
      let fileUrl = "";
      try {
        const targetDirs = [
          path.join(process.cwd(), "dist", "wappin_pdf"),
          path.join(process.cwd(), "public", "wappin_pdf"),
          path.join(process.cwd(), "wappin_pdf")
        ];
        targetDirs.forEach((dir) => {
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        });
        const pdfFilename = `${guest.barcodeUid}_${Date.now()}.pdf`;
        const targetBase64 = guest.customInvitationFile || event.invitationFile || "";
        if (!targetBase64) {
          throw new Error("Tamu ini dan Event ini tidak memiliki file PDF undangan. Harap unggah PDF terlebih dahulu.");
        }
        let pdfBuffer = null;
        const matches = targetBase64.match(/^data:(.+);base64,([\s\S]+)$/);
        if (matches && matches.length === 3) {
          pdfBuffer = Buffer.from(matches[2], "base64");
        } else if (targetBase64.trim().startsWith("JVBERi")) {
          pdfBuffer = Buffer.from(targetBase64.trim(), "base64");
        }
        if (pdfBuffer) {
          targetDirs.forEach((dir) => {
            fs.writeFileSync(path.join(dir, pdfFilename), pdfBuffer);
          });
          fileUrl = `${appUrl}/api/guests/download-physical-pdf/${pdfFilename}`;
        } else if (targetBase64.startsWith("http://") || targetBase64.startsWith("https://")) {
          fileUrl = targetBase64;
        } else {
          fileUrl = guest.customInvitationFile ? `${appUrl}/api/guests/public/invitation/${guest.barcodeUid}/undangan.pdf` : `${appUrl}/api/events/public/invitation/${event.eventName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/undangan.pdf`;
        }
      } catch (err) {
        console.error("Error creating physical PDF:", err);
        fileUrl = guest.customInvitationFile ? `${appUrl}/api/guests/public/invitation/${guest.barcodeUid}/undangan.pdf` : `${appUrl}/api/events/public/invitation/${event.eventName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/undangan.pdf`;
      }
      const eventDateStr = new Date(event.eventDate || "").toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", weekday: "long", year: "numeric", month: "long", day: "numeric" });
      const rawTime = new Date(event.eventDate || "").toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit" }).replace(".", ":");
      const eventTimeStr = rawTime.includes("WIB") ? rawTime : `${rawTime} WIB`;
      const documentFilename = `${(guest.guestName || "Undangan").replace(/[^a-zA-Z0-9]/g, "_")}_Undangan.pdf`;
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
                { type: "text", text: (guest.guestName || "-").replace(/[\r\n]+/g, " ") },
                { type: "text", text: (event.eventName || "Acara").replace(/[\r\n]+/g, " ") },
                { type: "text", text: eventDateStr || "-" },
                { type: "text", text: eventTimeStr || "-" },
                { type: "text", text: (event.location || "-").replace(/[\r\n]+/g, " ") },
                { type: "text", text: fileUrl },
                { type: "text", text: rsvpUrl }
              ]
            }
          ]
        }
      };
      try {
        const sendUrl = "https://api.chat.wappin.app/v1/messages";
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${activeBearerToken}`
        };
        if (process.env.WAPPIN_PROJECT_ID) {
          headers["Wappin-Project-Id"] = process.env.WAPPIN_PROJECT_ID;
        }
        const response = await fetch(sendUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          const wappinError = await response.json().catch(() => ({}));
          const errMsg = wappinError.errors?.[0]?.details || wappinError.errors?.[0]?.title || `HTTP ${response.status} ${JSON.stringify(wappinError)}`;
          fs.appendFileSync(path.join(process.cwd(), "debug-wappin.log"), `[${(/* @__PURE__ */ new Date()).toISOString()}] WAPPIN ERROR: ${errMsg}
PAYLOAD: ${JSON.stringify(payload, null, 2)}

`);
          throw new Error(errMsg);
        }
        fs.appendFileSync(path.join(process.cwd(), "debug-wappin.log"), `[${(/* @__PURE__ */ new Date()).toISOString()}] WAPPIN SUCCESS for ${recipientWaId}

`);
        const data = await response.json();
        console.log(`[WAPPIN SUCCESS] Ke ${recipientWaId}:`, JSON.stringify(data));
        try {
          await db.update(guests).set({ wappinSent: true }).where((0, import_drizzle_orm5.eq)(guests.id, guest.id));
        } catch (dbErr) {
          console.warn("Wappin message sent, but failed to update DB (run db:push):", dbErr.message);
        }
        results.push({ guestId: guest.id, status: "success", data });
      } catch (err) {
        console.error(`[WAPPIN FAILED] Ke ${recipientWaId}:`, err.message || String(err));
        results.push({ guestId: guest.id, status: "failed", error: err.message || String(err) });
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    const hasError = results.some((r) => r.status === "failed");
    if (hasError) {
      const errDetails = results.filter((r) => r.status === "failed").map((r) => r.error).join(" | ");
      fs.appendFileSync(path.join(process.cwd(), "debug-wappin.log"), `[${(/* @__PURE__ */ new Date()).toISOString()}] BULK FAILURES: ${errDetails}

`);
      return res.status(400).json({ error: `Gagal: ${errDetails}`, results });
    }
    return res.json({ success: true, results });
  } catch (error) {
    console.error("Wappin send error:", error);
    res.status(500).json({ error: "Internal server error: " + (error.stack || error.message || String(error)) });
  }
});
var guest_routes_default = router4;

// src/modules/scanner/scanner.routes.ts
var import_express5 = require("express");
var import_drizzle_orm6 = require("drizzle-orm");
var router5 = (0, import_express5.Router)();
router5.post("/scan", jwtAuthGuard, tenantGuard, async (req, res) => {
  try {
    const { barcodeUid, eventId } = req.body;
    const { officeId, role } = req.user;
    if (!barcodeUid || !eventId) {
      return res.status(400).json({ error: "barcodeUid and eventId are required" });
    }
    const eventResult = await db.select().from(events).where((0, import_drizzle_orm6.eq)(events.id, eventId)).limit(1);
    if (eventResult.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    const event = eventResult[0];
    if (role === "office_admin" && event.officeId !== officeId) {
      return res.status(403).json({ error: "Forbidden: Event does not belong to your office" });
    }
    if (!event.isActive) {
      return res.status(400).json({ error: "Event is no longer active" });
    }
    const guestResult = await db.select().from(guests).where((0, import_drizzle_orm6.eq)(guests.barcodeUid, barcodeUid)).limit(1);
    if (guestResult.length === 0) {
      return res.status(404).json({ error: "Guest not found / Invalid barcode" });
    }
    const guest = guestResult[0];
    if (guest.eventId !== eventId) {
      return res.status(400).json({ error: "Guest is not registered for this event" });
    }
    const existingAttendance = await db.select().from(attendances).where((0, import_drizzle_orm6.and)((0, import_drizzle_orm6.eq)(attendances.guestId, guest.id), (0, import_drizzle_orm6.eq)(attendances.eventId, eventId))).limit(1);
    if (existingAttendance.length > 0) {
      return res.status(400).json({ error: "Guest has already been scanned for this event" });
    }
    const attendanceResult = await db.insert(attendances).values({
      guestId: guest.id,
      eventId,
      status: "attended"
    }).returning();
    res.json({ message: "Attendance recorded successfully", data: attendanceResult[0], guest });
  } catch (error) {
    console.error("Scan error:", error);
    res.status(500).json({ error: "Internal server error", cause: error });
  }
});
var scanner_routes_default = router5;

// src/modules/reports/report.routes.ts
var import_express6 = require("express");
var import_drizzle_orm7 = require("drizzle-orm");
var router6 = (0, import_express6.Router)();
router6.use(jwtAuthGuard, tenantGuard);
router6.get("/analytics", async (req, res) => {
  try {
    const officeId = req.user?.officeId;
    if (!officeId) {
      return res.status(403).json({ error: "Unauthorized: Office ID missing" });
    }
    const { startDate, endDate, eventId } = req.query;
    let eventFilter = (0, import_drizzle_orm7.eq)(events.officeId, officeId);
    if (eventId) {
      eventFilter = (0, import_drizzle_orm7.and)(eventFilter, (0, import_drizzle_orm7.eq)(events.id, String(eventId)));
    }
    if (startDate) {
      eventFilter = (0, import_drizzle_orm7.and)(eventFilter, (0, import_drizzle_orm7.gte)(events.eventDate, new Date(String(startDate))));
    }
    if (endDate) {
      const end = new Date(String(endDate));
      end.setHours(23, 59, 59, 999);
      eventFilter = (0, import_drizzle_orm7.and)(eventFilter, (0, import_drizzle_orm7.lte)(events.eventDate, end));
    }
    const filteredEvents = await db.select().from(events).where(eventFilter);
    const eventIds = filteredEvents.map((e) => e.id);
    if (eventIds.length === 0) {
      return res.json({
        totalRegistered: 0,
        totalAttended: 0,
        attendanceRate: 0,
        eventsData: []
      });
    }
    const allGuests = await db.select().from(guests).where((0, import_drizzle_orm7.inArray)(guests.eventId, eventIds));
    const allAttendances = await db.select().from(attendances).where((0, import_drizzle_orm7.inArray)(attendances.eventId, eventIds));
    const totalRegistered = allGuests.length;
    const totalAttended = allAttendances.filter((a) => a.status === "attended").length;
    const attendanceRate = totalRegistered > 0 ? totalAttended / totalRegistered * 100 : 0;
    const eventsData = filteredEvents.map((event) => {
      const eventGuests = allGuests.filter((g) => g.eventId === event.id).length;
      const eventAttended = allAttendances.filter((a) => a.eventId === event.id && a.status === "attended").length;
      return {
        id: event.id,
        name: event.eventName,
        date: event.eventDate,
        registered: eventGuests,
        attended: eventAttended,
        rate: eventGuests > 0 ? eventAttended / eventGuests * 100 : 0
      };
    });
    res.json({
      totalRegistered,
      totalAttended,
      attendanceRate,
      eventsData
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});
router6.get("/export/csv", async (req, res) => {
  try {
    const officeId = req.user?.officeId;
    if (!officeId) {
      return res.status(403).json({ error: "Unauthorized: Office ID missing" });
    }
    const { startDate, endDate, eventId } = req.query;
    let eventFilter = (0, import_drizzle_orm7.eq)(events.officeId, officeId);
    if (eventId) {
      eventFilter = (0, import_drizzle_orm7.and)(eventFilter, (0, import_drizzle_orm7.eq)(events.id, String(eventId)));
    }
    if (startDate) {
      eventFilter = (0, import_drizzle_orm7.and)(eventFilter, (0, import_drizzle_orm7.gte)(events.eventDate, new Date(String(startDate))));
    }
    if (endDate) {
      const end = new Date(String(endDate));
      end.setHours(23, 59, 59, 999);
      eventFilter = (0, import_drizzle_orm7.and)(eventFilter, (0, import_drizzle_orm7.lte)(events.eventDate, end));
    }
    const filteredEvents = await db.select().from(events).where(eventFilter);
    const eventIds = filteredEvents.map((e) => e.id);
    if (eventIds.length === 0) {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", 'attachment; filename="report.csv"');
      return res.send("Event,Guest Name,Email,Status,Scanned At\n");
    }
    const reportData = await db.select({
      eventName: events.eventName,
      guestName: guests.guestName,
      email: guests.email,
      status: attendances.status,
      scannedAt: attendances.scannedAt
    }).from(guests).innerJoin(events, (0, import_drizzle_orm7.eq)(guests.eventId, events.id)).leftJoin(attendances, (0, import_drizzle_orm7.eq)(guests.id, attendances.guestId)).where((0, import_drizzle_orm7.inArray)(events.id, eventIds));
    let csv = "Event,Guest Name,Email,Status,Scanned At\n";
    reportData.forEach((row) => {
      const status = row.status || "Not Attended";
      const scannedAt = row.scannedAt ? new Date(row.scannedAt).toLocaleString() : "N/A";
      csv += `"${row.eventName}","${row.guestName}","${row.email || ""}","${status}","${scannedAt}"
`;
    });
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="attendance_report.csv"');
    res.send(csv);
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).json({ error: "Failed to export CSV" });
  }
});
var report_routes_default = router6;

// src/modules/pics/pic.routes.ts
var import_express7 = require("express");
var import_drizzle_orm8 = require("drizzle-orm");
var import_bcrypt3 = __toESM(require("bcrypt"), 1);
var router7 = (0, import_express7.Router)();
router7.use(jwtAuthGuard);
router7.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const officeId = req.user?.officeId;
    if (!officeId || req.user?.role !== "office_admin") {
      return res.status(403).json({ error: "Only office admin can create PICs" });
    }
    const username = name.split(" ")[0].toLowerCase() + Math.floor(Math.random() * 1e3);
    const hash = await import_bcrypt3.default.hash("123456", 10);
    const result = await db.insert(users).values({
      officeId,
      username,
      passwordHash: hash,
      role: "pic"
    }).returning();
    const { passwordHash, ...safeUser } = result[0];
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", cause: error });
  }
});
router7.get("/", async (req, res) => {
  try {
    const officeId = req.user?.officeId;
    if (!officeId) return res.status(403).json({ error: "Forbidden" });
    const pics = await db.select({
      id: users.id,
      username: users.username,
      role: users.role
    }).from(users).where(
      (0, import_drizzle_orm8.and)(
        (0, import_drizzle_orm8.eq)(users.officeId, officeId),
        (0, import_drizzle_orm8.eq)(users.role, "pic")
      )
    );
    res.json(pics);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", cause: error });
  }
});
var pic_routes_default = router7;

// src/modules/notification/notification.routes.ts
var import_express8 = require("express");
var router8 = (0, import_express8.Router)();
router8.post("/wappin", async (req, res) => {
  try {
    const payload = req.body;
    console.log("--- Wappin Webhook Callback ---");
    console.log("Received payload:", JSON.stringify(payload, null, 2));
    res.status(200).json({ status: "success", message: "Callback received successfully" });
  } catch (error) {
    console.error("Wappin webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router8.get("/wappin", (req, res) => {
  res.status(200).send("Wappin callback endpoint is active.");
});
var notification_routes_default = router8;

// server.ts
async function startServer() {
  const app = (0, import_express9.default)();
  const PORT = process.env.PORT || 3e3;
  app.use(import_express9.default.json({ limit: "200mb" }));
  app.use(import_express9.default.urlencoded({ limit: "200mb", extended: true }));
  app.get("/undangan/:slug", (req, res) => {
    res.redirect(`/api/events/public/invitation/${req.params.slug}`);
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/api/auth", auth_routes_default);
  app.use("/api/offices", office_routes_default);
  app.use("/api/events", event_routes_default);
  app.use("/api/guests", guest_routes_default);
  app.use("/api/scanner", scanner_routes_default);
  app.use("/api/reports", report_routes_default);
  app.use("/api/pics", pic_routes_default);
  app.use("/api/notification", notification_routes_default);
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express9.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
