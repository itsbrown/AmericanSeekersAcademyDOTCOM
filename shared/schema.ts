import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const locationSuggestions = pgTable("location_suggestions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  location: text("location").notNull(),
  comments: text("comments"),
  createdAt: text("created_at").notNull(),
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
  createdAt: text("created_at").notNull(),
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
  createdAt: text("created_at").notNull(),
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
  createdAt: text("created_at").notNull(),
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
  publishedAt: text("published_at"),
  createdAt: text("created_at").notNull(),
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
  createdAt: text("created_at").notNull(),
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
  createdAt: text("created_at").notNull(),
  expiresAt: text("expires_at").notNull(),
});

export type AdminSession = typeof adminSessions.$inferSelect;

export const emailTestRuns = pgTable("email_test_runs", {
  id: serial("id").primaryKey(),
  flow: text("flow").notNull(),
  sentTo: text("sent_to").notNull(),
  hubspotStatusId: text("hubspot_status_id"),
  hubspotSendId: text("hubspot_send_id"),
  apiAccepted: boolean("api_accepted").notNull().default(false),
  errorMessage: text("error_message"),
  sentAt: text("sent_at").notNull(),
  inboxConfirmedAt: text("inbox_confirmed_at"),
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
  createdAt: text("created_at").notNull(),
});

export const announcementTypeEnum = ["general", "new-class", "update"] as const;
export type AnnouncementType = typeof announcementTypeEnum[number];

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
}).extend({
  type: z.enum(announcementTypeEnum),
});

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;
