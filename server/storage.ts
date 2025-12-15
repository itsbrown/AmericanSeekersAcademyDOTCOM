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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private locationSuggestions: Map<number, LocationSuggestion>;
  private newsletters: Map<number, Newsletter>;
  private programInfoRequests: Map<number, ProgramInfoRequest>;
  private userCurrentId: number;
  private locationSuggestionCurrentId: number;
  private newsletterCurrentId: number;
  private programInfoRequestCurrentId: number;

  constructor() {
    this.users = new Map();
    this.locationSuggestions = new Map();
    this.newsletters = new Map();
    this.programInfoRequests = new Map();
    this.userCurrentId = 1;
    this.locationSuggestionCurrentId = 1;
    this.newsletterCurrentId = 1;
    this.programInfoRequestCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Location suggestion methods
  async createLocationSuggestion(suggestion: InsertLocationSuggestion): Promise<LocationSuggestion> {
    const id = this.locationSuggestionCurrentId++;
    const nowISOString = new Date().toISOString();
    const locationSuggestion: LocationSuggestion = { 
      ...suggestion, 
      id, 
      createdAt: nowISOString 
    };
    this.locationSuggestions.set(id, locationSuggestion);
    return locationSuggestion;
  }
  
  async getLocationSuggestions(): Promise<LocationSuggestion[]> {
    return Array.from(this.locationSuggestions.values());
  }
  
  // Newsletter subscription methods
  async subscribeToNewsletter(newsletter: InsertNewsletter): Promise<Newsletter> {
    // Check if email already exists
    const exists = await this.isEmailSubscribed(newsletter.email);
    
    if (exists) {
      throw new Error("Email already subscribed");
    }
    
    const id = this.newsletterCurrentId++;
    const nowISOString = new Date().toISOString();
    const newNewsletter: Newsletter = { 
      ...newsletter, 
      id, 
      createdAt: nowISOString 
    };
    this.newsletters.set(id, newNewsletter);
    return newNewsletter;
  }
  
  async isEmailSubscribed(email: string): Promise<boolean> {
    return Array.from(this.newsletters.values()).some(
      (newsletter) => newsletter.email === email,
    );
  }
  
  // Program info request methods
  async createProgramInfoRequest(request: InsertProgramInfoRequest): Promise<ProgramInfoRequest> {
    const id = this.programInfoRequestCurrentId++;
    const nowISOString = new Date().toISOString();
    const programInfoRequest: ProgramInfoRequest = { 
      ...request, 
      id, 
      createdAt: nowISOString 
    };
    this.programInfoRequests.set(id, programInfoRequest);
    return programInfoRequest;
  }
}

export const storage = new MemStorage();
