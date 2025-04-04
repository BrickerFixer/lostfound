import { items, type Item, type InsertItem } from "@shared/schema";
import { db } from "./db";
import { eq, or, and, ilike, not, desc } from "drizzle-orm";

export interface IStorage {
  getItems(): Promise<Item[]>;
  getItem(id: number): Promise<Item | undefined>;
  searchItems(query: string): Promise<Item[]>;
  createItem(item: InsertItem): Promise<Item>;
  markItemAsReturned(id: number): Promise<Item | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getItems(): Promise<Item[]> {
    return db
      .select()
      .from(items)
      .where(eq(items.isReturned, false))
      .orderBy(desc(items.dateCreated));
  }

  async getItem(id: number): Promise<Item | undefined> {
    const result = await db
      .select()
      .from(items)
      .where(eq(items.id, id));
    
    return result.length > 0 ? result[0] : undefined;
  }

  async searchItems(query: string): Promise<Item[]> {
    if (!query || query.trim() === "") {
      return this.getItems();
    }
    
    return db
      .select()
      .from(items)
      .where(
        and(
          eq(items.isReturned, false),
          or(
            ilike(items.name, `%${query}%`),
            ilike(items.description, `%${query}%`),
            ilike(items.location, `%${query}%`)
          )
        )
      )
      .orderBy(desc(items.dateCreated));
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const result = await db
      .insert(items)
      .values({
        ...insertItem,
        isReturned: false,
        dateCreated: new Date()
      })
      .returning();
    
    return result[0];
  }

  async markItemAsReturned(id: number): Promise<Item | undefined> {
    const item = await this.getItem(id);
    
    if (!item) {
      return undefined;
    }
    
    const result = await db
      .update(items)
      .set({ isReturned: true })
      .where(eq(items.id, id))
      .returning();
    
    return result.length > 0 ? result[0] : undefined;
  }
}

export const storage = new DatabaseStorage();
