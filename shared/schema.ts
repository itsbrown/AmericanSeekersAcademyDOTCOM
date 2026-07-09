import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// =============================================================================
// SCHEMA NOTES
// =============================================================================

// DATE HANDLING NOTE (Migration Largely Complete):
// All timestamp columns have been migrated to proper `timestamp(..., { withTimezone: true })`.
// This gives us real Date objects from the database, proper timezone handling, and better
// query capabilities.
//
// - When inserting: Pass `new Date()` (or let `.defaultNow()` handle it).
// - When reading: You will receive `Date` objects (Drizzle + pg driver handle conversion).
// - JSON responses will serialize these Dates as ISO strings (standard behavior).
//
// The old `text` columns have been replaced. Run `npm run db:push` (or generate a migration)
// after pulling these changes. Existing data in production will need a one-time backfill
// if you want to preserve historical timestamps (or you can treat old rows as having
// approximate dates based on other fields).

// AUTH NOTE:
// The original `users` table (below, now removed) + passport dependencies were
// vestigial. Only the custom `admin_sessions` bearer token system is used for admin access.

export const locationSuggestions = pgTable("location_suggestions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  location: text("location").notNull(),
  comments: text("comments"),
  // Migrated to proper timestamp
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertLocationSuggestionSchema = createInsertSchema(locationSuggestions).pick({
  name: true,
  email: true,
  location: true,
  comments: true,
});

export type InsertLocationSuggestion = z.infer<typeof insertLocationSuggestionSchema>;
export type LocationSuggestion = typeof locationSuggestions.$inferSelect;

export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  // Migrated to proper timestamp
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertNewsletterSchema = createInsertSchema(newsletters).pick({
  email: true,
});

export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type Newsletter = typeof newsletters.$inferSelect;

export const programInfoRequests = pgTable("program_info_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  programSlug: text("program_slug").notNull(),
  programName: text("program_name").notNull(),
  // Migrated to proper timestamp
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProgramInfoRequestSchema = createInsertSchema(programInfoRequests).pick({
  name: true,
  email: true,
  phone: true,
  programSlug: true,
  programName: true,
});

export type InsertProgramInfoRequest = z.infer<typeof insertProgramInfoRequestSchema>;
export type ProgramInfoRequest = typeof programInfoRequests.$inferSelect;

export const contactInquiries = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  phoneOptOut: boolean("phone_opt_out").notNull().default(false),
  // Migrated to proper timestamp
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).pick({
  name: true,
  email: true,
  phone: true,
  message: true,
  phoneOptOut: true,
}).extend({
  phoneOptOut: z.boolean().optional().default(false),
});

export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  published: boolean("published").notNull().default(false),
  // Migrated to proper timestamp
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
});

export const updateBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
}).partial();

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  path: text("path").notNull(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  // Migrated to proper timestamp
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPageViewSchema = createInsertSchema(pageViews).pick({
  path: true,
  referrer: true,
  userAgent: true,
}).extend({
  userAgent: z.string().nullable().optional(),
  referrer: z.string().nullable().optional(),
});

export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type PageView = typeof pageViews.$inferSelect;

export const adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  sessionToken: text("session_token").notNull().unique(),
  // Migrated to proper timestamp
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export type AdminSession = typeof adminSessions.$inferSelect;

export const emailTestRuns = pgTable("email_test_runs", {
  id: serial("id").primaryKey(),
  flow: text("flow").notNull(),
  sentTo: text("sent_to").notNull(),
  // Legacy columns from when HubSpot was used for transactional emails.
  // They may still contain data from old test runs. New records should use
  // the provider + providerMessageId columns below.
  hubspotStatusId: text("hubspot_status_id"),
  hubspotSendId: text("hubspot_send_id"),

  // Current provider information (preferred for new records)
  provider: text("provider"),                    // e.g. "sendgrid"
  providerMessageId: text("provider_message_id"), // SendGrid sendId or equivalent

  apiAccepted: boolean("api_accepted").notNull().default(false),
  errorMessage: text("error_message"),
  // Migrated to proper timestamp
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
  inboxConfirmedAt: timestamp("inbox_confirmed_at", { withTimezone: true }),
  confirmedBy: text("confirmed_by"),
});

export type EmailTestRun = typeof emailTestRuns.$inferSelect;

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(),
  published: boolean("published").notNull().default(false),
  pinned: boolean("pinned").notNull().default(false),
  url: text("url"),
  image: text("image"),
  // Migrated to proper timestamp
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  // Set when we have sent email notifications to contacts about this announcement going live.
  // Used to prevent duplicate notifications if an announcement is toggled published multiple times.
  notificationSentAt: timestamp("notification_sent_at", { withTimezone: true }),
  // Set when an admin explicitly clicks "Post to Facebook" for this announcement.
  // Used only for display/history ("Last posted") in the admin list. Buttons remain available anytime.
  facebookPostedAt: timestamp("facebook_posted_at", { withTimezone: true }),
  // Set when an admin explicitly triggers a post to Google Business Profile (via webhook or future direct).
  // Used only for display/history in the admin list. Buttons remain available anytime.
  googlePostedAt: timestamp("google_posted_at", { withTimezone: true }),
});

export const registrationWaitlist = pgTable("registration_waitlist", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  programInterest: text("program_interest"),
  locationInterest: text("location_interest"), // New field for location-specific waitlists
  // Migrated to proper timestamp
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertRegistrationWaitlistSchema = createInsertSchema(registrationWaitlist).omit({
  id: true,
  createdAt: true,
}).extend({
  phone: z.string().optional(),
  programInterest: z.string().optional(),
  locationInterest: z.string().optional(),
});

export type InsertRegistrationWaitlist = z.infer<typeof insertRegistrationWaitlistSchema>;
export type RegistrationWaitlistEntry = typeof registrationWaitlist.$inferSelect;

export const announcementTypeEnum = ["general", "new-class", "update"] as const;
export type AnnouncementType = typeof announcementTypeEnum[number];

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
}).extend({
  type: z.enum(announcementTypeEnum),
  url: z.string().url().optional().or(z.literal("")),
  image: z.string().url().optional().or(z.literal("")),
});

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;
