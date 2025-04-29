import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLocationSuggestionSchema, insertNewsletterSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for location suggestions
  app.post("/api/location-suggestions", async (req: Request, res: Response) => {
    try {
      const validatedData = insertLocationSuggestionSchema.parse(req.body);
      const suggestion = await storage.createLocationSuggestion(validatedData);
      res.status(201).json({ success: true, suggestion });
    } catch (error) {
      if (error instanceof Error) {
        const validationError = fromZodError(error);
        res.status(400).json({ success: false, message: validationError.message });
      } else {
        res.status(500).json({ success: false, message: "An unexpected error occurred" });
      }
    }
  });

  app.get("/api/location-suggestions", async (req: Request, res: Response) => {
    try {
      const suggestions = await storage.getLocationSuggestions();
      res.status(200).json({ success: true, suggestions });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve location suggestions" });
    }
  });

  // API routes for newsletter subscriptions
  app.post("/api/newsletter", async (req: Request, res: Response) => {
    try {
      const validatedData = insertNewsletterSchema.parse(req.body);
      
      // Check if email is already subscribed
      const isSubscribed = await storage.isEmailSubscribed(validatedData.email);
      
      if (isSubscribed) {
        return res.status(400).json({ 
          success: false, 
          message: "This email is already subscribed to our newsletter" 
        });
      }
      
      const subscription = await storage.subscribeToNewsletter(validatedData);
      res.status(201).json({ success: true, subscription });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Email already subscribed") {
          res.status(400).json({ success: false, message: error.message });
        } else {
          const validationError = fromZodError(error);
          res.status(400).json({ success: false, message: validationError.message });
        }
      } else {
        res.status(500).json({ success: false, message: "An unexpected error occurred" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
