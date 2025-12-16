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
  programSlug: text("program_slug").notNull(),
  programName: text("program_name").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertProgramInfoRequestSchema = createInsertSchema(programInfoRequests).pick({
  name: true,
  email: true,
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
  createdAt: text("created_at").notNull(),
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).pick({
  name: true,
  email: true,
  phone: true,
  message: true,
});

export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;
