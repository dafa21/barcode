CREATE TYPE "public"."role" AS ENUM('super_admin', 'office_admin', 'pic');--> statement-breakpoint
CREATE TYPE "public"."rsvp_status" AS ENUM('pending', 'attending', 'not_attending');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('attended', 'invalid');--> statement-breakpoint
CREATE TABLE "attendances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guest_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"scanned_at" timestamp DEFAULT now(),
	"status" "status" DEFAULT 'attended'
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"office_id" uuid NOT NULL,
	"event_name" varchar(255) NOT NULL,
	"event_date" timestamp NOT NULL,
	"location" text,
	"is_active" boolean DEFAULT true,
	"logo" text,
	"twibbon_background" text,
	"twibbon_config" text,
	"invitation_file" text,
	"letter_background" text,
	"letter_size" varchar(20) DEFAULT 'A4',
	"letter_content" text,
	"backsound" text,
	"hero_image" text,
	"gallery" text,
	"maps_link" text,
	"theme_primary" varchar(20) DEFAULT '#b45309',
	"theme_secondary" varchar(20) DEFAULT '#fef3c7',
	"opening_quote" text,
	"event_end_date" timestamp,
	"rundown" text,
	"social_website" text,
	"social_youtube" text,
	"social_instagram" text
);
--> statement-breakpoint
CREATE TABLE "guests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"pic_id" uuid,
	"guest_name" varchar(255) NOT NULL,
	"company" varchar(255),
	"job_title" varchar(255),
	"guest_type" varchar(100),
	"email" varchar(100),
	"phone" varchar(20),
	"barcode_uid" varchar(100) NOT NULL,
	"rsvp_status" "rsvp_status" DEFAULT 'pending',
	"rsvp_updated_at" timestamp,
	"is_vip" boolean DEFAULT false,
	"pax_count" integer DEFAULT 1,
	"custom_invitation_file" text,
	"wappin_sent" boolean DEFAULT false,
	"manual_wa_sent" boolean DEFAULT false,
	CONSTRAINT "guests_barcode_uid_unique" UNIQUE("barcode_uid")
);
--> statement-breakpoint
CREATE TABLE "offices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"office_name" varchar(255) NOT NULL,
	"contact_email" varchar(100),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" text,
	"office_id" uuid,
	"username" varchar(50) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "role" NOT NULL,
	CONSTRAINT "users_uid_unique" UNIQUE("uid"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_guest_id_guests_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_office_id_offices_id_fk" FOREIGN KEY ("office_id") REFERENCES "public"."offices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_pic_id_users_id_fk" FOREIGN KEY ("pic_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_office_id_offices_id_fk" FOREIGN KEY ("office_id") REFERENCES "public"."offices"("id") ON DELETE no action ON UPDATE no action;