import { db } from "./db";
import { eq, desc, sql, gte } from "drizzle-orm";
import { 
  users, type User, type InsertUser,
  locationSuggestions, type LocationSuggestion, type InsertLocationSuggestion,
  newsletters, type Newsletter, type InsertNewsletter,
  programInfoRequests, type ProgramInfoRequest, type InsertProgramInfoRequest,
  contactInquiries, type ContactInquiry, type InsertContactInquiry,
  blogPosts, type BlogPost, type InsertBlogPost,
  pageViews, type PageView, type InsertPageView,
  adminSessions, type AdminSession,
  announcements, type Announcement, type InsertAnnouncement,
  emailTestRuns, type EmailTestRun,
  registrationWaitlist, type RegistrationWaitlistEntry, type InsertRegistrationWaitlist,
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Location suggestion methods
  createLocationSuggestion(suggestion: InsertLocationSuggestion): Promise<LocationSuggestion>;
  getLocationSuggestions(): Promise<LocationSuggestion[]>;
  
  // Newsletter subscription methods
  subscribeToNewsletter(email: InsertNewsletter): Promise<Newsletter>;
  isEmailSubscribed(email: string): Promise<boolean>;
  
  // Program info request methods
  createProgramInfoRequest(request: InsertProgramInfoRequest): Promise<ProgramInfoRequest>;
  
  // Contact inquiry methods
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  
  // Blog post methods
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  
  // Page view analytics methods
  createPageView(view: InsertPageView): Promise<PageView>;
  getPageViews(): Promise<PageView[]>;
  getPageViewStats(): Promise<{ path: string; count: number }[]>;
  getReferrerStats(): Promise<{ referrer: string; count: number }[]>;
  getRecentPageViews(limit: number): Promise<PageView[]>;
  
  // Admin session methods
  createAdminSession(token: string, expiresAt: Date): Promise<AdminSession>;
  getAdminSession(token: string): Promise<AdminSession | undefined>;
  deleteAdminSession(token: string): Promise<boolean>;
  cleanExpiredSessions(): Promise<void>;
  
  // Additional data retrieval for admin
  getContactInquiries(): Promise<ContactInquiry[]>;
  getProgramInfoRequests(): Promise<ProgramInfoRequest[]>;
  getNewsletterSubscriptions(): Promise<Newsletter[]>;

  // Announcement methods
  getPublishedAnnouncements(): Promise<Announcement[]>;
  getAllAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;

  // Email test run methods
  createEmailTestRun(run: Omit<EmailTestRun, "id">): Promise<EmailTestRun>;
  getEmailTestRuns(): Promise<EmailTestRun[]>;
  confirmEmailTestRun(id: number, confirmedBy: string): Promise<EmailTestRun | undefined>;

  // Registration waitlist methods
  createRegistrationWaitlistEntry(entry: InsertRegistrationWaitlist): Promise<RegistrationWaitlistEntry>;
  getRegistrationWaitlistEntries(): Promise<RegistrationWaitlistEntry[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Location suggestion methods
  async createLocationSuggestion(suggestion: InsertLocationSuggestion): Promise<LocationSuggestion> {
    const nowISOString = new Date().toISOString();
    const [locationSuggestion] = await db.insert(locationSuggestions).values({
      ...suggestion,
      createdAt: nowISOString
    }).returning();
    return locationSuggestion;
  }
  
  async getLocationSuggestions(): Promise<LocationSuggestion[]> {
    return await db.select().from(locationSuggestions);
  }
  
  // Newsletter subscription methods
  async subscribeToNewsletter(newsletter: InsertNewsletter): Promise<Newsletter> {
    const exists = await this.isEmailSubscribed(newsletter.email);
    
    if (exists) {
      throw new Error("Email already subscribed");
    }
    
    const nowISOString = new Date().toISOString();
    const [newNewsletter] = await db.insert(newsletters).values({
      ...newsletter,
      createdAt: nowISOString
    }).returning();
    return newNewsletter;
  }
  
  async isEmailSubscribed(email: string): Promise<boolean> {
    const [existing] = await db.select().from(newsletters).where(eq(newsletters.email, email));
    return !!existing;
  }
  
  // Program info request methods
  async createProgramInfoRequest(request: InsertProgramInfoRequest): Promise<ProgramInfoRequest> {
    const nowISOString = new Date().toISOString();
    const [programInfoRequest] = await db.insert(programInfoRequests).values({
      ...request,
      createdAt: nowISOString
    }).returning();
    return programInfoRequest;
  }
  
  // Contact inquiry methods
  async createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const nowISOString = new Date().toISOString();
    const [contactInquiry] = await db.insert(contactInquiries).values({
      ...inquiry,
      createdAt: nowISOString
    }).returning();
    return contactInquiry;
  }
  
  // Blog post methods
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const nowISOString = new Date().toISOString();
    const [blogPost] = await db.insert(blogPosts).values({
      ...post,
      createdAt: nowISOString
    }).returning();
    return blogPost;
  }
  
  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [blogPost] = await db.update(blogPosts).set(post).where(eq(blogPosts.id, id)).returning();
    return blogPost;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return result.length > 0;
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }
  
  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(eq(blogPosts.published, true));
  }
  
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts);
  }
  
  // Page view analytics methods
  private sanitizeReferrer(referrer: string | null | undefined): string | null {
    if (!referrer) return null;
    try {
      const url = new URL(referrer);
      return url.hostname || null;
    } catch {
      return null;
    }
  }

  async createPageView(view: InsertPageView): Promise<PageView> {
    const nowISOString = new Date().toISOString();
    const [pageView] = await db.insert(pageViews).values({
      path: view.path,
      referrer: this.sanitizeReferrer(view.referrer),
      userAgent: null,
      createdAt: nowISOString
    }).returning();
    return pageView;
  }
  
  async getPageViews(): Promise<PageView[]> {
    return await db.select().from(pageViews).orderBy(desc(pageViews.createdAt));
  }
  
  async getPageViewStats(): Promise<{ path: string; count: number }[]> {
    const result = await db
      .select({
        path: pageViews.path,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(pageViews)
      .groupBy(pageViews.path)
      .orderBy(sql`count(*) desc`);
    return result;
  }
  
  async getReferrerStats(): Promise<{ referrer: string; count: number }[]> {
    const result = await db
      .select({
        referrer: sql<string>`coalesce(${pageViews.referrer}, 'Direct')`,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(pageViews)
      .groupBy(sql`coalesce(${pageViews.referrer}, 'Direct')`)
      .orderBy(sql`count(*) desc`);
    return result;
  }
  
  async getRecentPageViews(limit: number): Promise<PageView[]> {
    return await db.select().from(pageViews).orderBy(desc(pageViews.createdAt)).limit(limit);
  }
  
  // Admin session methods
  async createAdminSession(token: string, expiresAt: Date): Promise<AdminSession> {
    const nowISOString = new Date().toISOString();
    const [session] = await db.insert(adminSessions).values({
      sessionToken: token,
      createdAt: nowISOString,
      expiresAt: expiresAt.toISOString()
    }).returning();
    return session;
  }
  
  async getAdminSession(token: string): Promise<AdminSession | undefined> {
    const [session] = await db.select().from(adminSessions).where(eq(adminSessions.sessionToken, token));
    if (session && new Date(session.expiresAt) > new Date()) {
      return session;
    }
    return undefined;
  }
  
  async deleteAdminSession(token: string): Promise<boolean> {
    const result = await db.delete(adminSessions).where(eq(adminSessions.sessionToken, token)).returning();
    return result.length > 0;
  }
  
  async cleanExpiredSessions(): Promise<void> {
    const now = new Date().toISOString();
    await db.delete(adminSessions).where(sql`${adminSessions.expiresAt} < ${now}`);
  }
  
  // Additional data retrieval for admin
  async getContactInquiries(): Promise<ContactInquiry[]> {
    return await db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
  }
  
  async getProgramInfoRequests(): Promise<ProgramInfoRequest[]> {
    return await db.select().from(programInfoRequests).orderBy(desc(programInfoRequests.createdAt));
  }
  
  async getNewsletterSubscriptions(): Promise<Newsletter[]> {
    return await db.select().from(newsletters).orderBy(desc(newsletters.createdAt));
  }

  // Announcement methods
  async getPublishedAnnouncements(): Promise<Announcement[]> {
    return await db
      .select()
      .from(announcements)
      .where(eq(announcements.published, true))
      .orderBy(desc(announcements.pinned), desc(announcements.createdAt));
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return await db
      .select()
      .from(announcements)
      .orderBy(desc(announcements.pinned), desc(announcements.createdAt));
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const nowISOString = new Date().toISOString();
    const [created] = await db.insert(announcements).values({
      ...announcement,
      createdAt: nowISOString,
    }).returning();
    return created;
  }

  async updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const [updated] = await db
      .update(announcements)
      .set(announcement)
      .where(eq(announcements.id, id))
      .returning();
    return updated;
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    const result = await db.delete(announcements).where(eq(announcements.id, id)).returning();
    return result.length > 0;
  }

  // Email test run methods
  async createEmailTestRun(run: Omit<EmailTestRun, "id">): Promise<EmailTestRun> {
    const [created] = await db.insert(emailTestRuns).values(run).returning();
    return created;
  }

  async getEmailTestRuns(): Promise<EmailTestRun[]> {
    return await db.select().from(emailTestRuns).orderBy(desc(emailTestRuns.sentAt));
  }

  async confirmEmailTestRun(id: number, confirmedBy: string): Promise<EmailTestRun | undefined> {
    const [updated] = await db
      .update(emailTestRuns)
      .set({ inboxConfirmedAt: new Date().toISOString(), confirmedBy })
      .where(eq(emailTestRuns.id, id))
      .returning();
    return updated;
  }

  // Registration waitlist methods
  async createRegistrationWaitlistEntry(entry: InsertRegistrationWaitlist): Promise<RegistrationWaitlistEntry> {
    const [created] = await db.insert(registrationWaitlist).values({
      ...entry,
      createdAt: new Date().toISOString(),
    }).returning();
    return created;
  }

  async getRegistrationWaitlistEntries(): Promise<RegistrationWaitlistEntry[]> {
    return await db.select().from(registrationWaitlist).orderBy(desc(registrationWaitlist.createdAt));
  }
}

export const storage = new DatabaseStorage();
