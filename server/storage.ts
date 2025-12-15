import { db } from "./db";
import { eq } from "drizzle-orm";
import { 
  users, type User, type InsertUser,
  locationSuggestions, type LocationSuggestion, type InsertLocationSuggestion,
  newsletters, type Newsletter, type InsertNewsletter,
  programInfoRequests, type ProgramInfoRequest, type InsertProgramInfoRequest
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
}

export const storage = new DatabaseStorage();
