import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertItemSchema, itemSearchSchema, itemReturnSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";

// Add multer types for Request
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Configure multer for in-memory file storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req: any, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Invalid file type. Only JPEG, PNG, GIF and WEBP are allowed.'));
    }
  }
});

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'dist', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all items (non-returned)
  app.get("/api/items", async (_req: Request, res: Response) => {
    try {
      const items = await storage.getItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Failed to fetch items" });
    }
  });

  // Search items
  app.get("/api/items/search", async (req: Request, res: Response) => {
    try {
      const result = itemSearchSchema.safeParse(req.query);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid search parameters" });
      }
      
      const { query } = result.data;
      const items = await storage.searchItems(query || "");
      
      res.json(items);
    } catch (error) {
      console.error("Error searching items:", error);
      res.status(500).json({ message: "Failed to search items" });
    }
  });

  // Get a specific item by ID
  app.get("/api/items/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid item ID" });
      }
      
      const item = await storage.getItem(id);
      
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      res.json(item);
    } catch (error) {
      console.error("Error fetching item:", error);
      res.status(500).json({ message: "Failed to fetch item" });
    }
  });

  // Create a new item
  app.post("/api/items", upload.single('image'), async (req: MulterRequest, res: Response) => {
    try {
      console.log("Received item creation request:", {
        file: req.file ? "File present" : "No file",
        body: req.body,
      });
      
      if (!req.file) {
        console.error("No file uploaded in the request");
        return res.status(400).json({ message: "Image file is required" });
      }

      // Ensure upload directory exists
      if (!fs.existsSync(uploadDir)) {
        console.log("Creating upload directory:", uploadDir);
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Save the file with a unique name
      const fileExt = path.extname(req.file.originalname);
      const fileName = `${nanoid()}${fileExt}`;
      const filePath = path.join(uploadDir, fileName);
      
      console.log("Saving uploaded file:", {
        fileName,
        filePath,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size
      });
      
      fs.writeFileSync(filePath, req.file.buffer);
      console.log("File saved successfully");
      
      // Add image URL to the item data
      const imageUrl = `/uploads/${fileName}`;
      const itemData = { ...req.body, imageUrl };
      console.log("Prepared item data with image URL:", itemData);

      // Validate the item data
      const result = insertItemSchema.safeParse(itemData);
      
      if (!result.success) {
        console.error("Invalid item data:", result.error.errors);
        // Remove the uploaded file
        fs.unlinkSync(filePath);
        return res.status(400).json({ 
          message: "Invalid item data", 
          errors: result.error.errors 
        });
      }
      
      // Create the item
      console.log("Creating item in storage...");
      const item = await storage.createItem(result.data);
      console.log("Item created successfully:", item);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating item:", error);
      res.status(500).json({ message: "Failed to create item" });
    }
  });

  // Mark an item as returned
  app.post("/api/items/return", async (req: Request, res: Response) => {
    try {
      const result = itemReturnSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid request data" });
      }
      
      const { id } = result.data;
      const item = await storage.markItemAsReturned(id);
      
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      res.json(item);
    } catch (error) {
      console.error("Error marking item as returned:", error);
      res.status(500).json({ message: "Failed to mark item as returned" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
