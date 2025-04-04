import { items, type Item, type InsertItem } from "@shared/schema";

export interface IStorage {
  getItems(): Promise<Item[]>;
  getItem(id: number): Promise<Item | undefined>;
  searchItems(query: string): Promise<Item[]>;
  createItem(item: InsertItem): Promise<Item>;
  markItemAsReturned(id: number): Promise<Item | undefined>;
}

export class MemStorage implements IStorage {
  private items: Map<number, Item>;
  private currentId: number;

  constructor() {
    this.items = new Map();
    this.currentId = 1;
  }

  async getItems(): Promise<Item[]> {
    return Array.from(this.items.values())
      .filter(item => !item.isReturned)
      .sort((a, b) => (b.dateCreated?.getTime() || 0) - (a.dateCreated?.getTime() || 0));
  }

  async getItem(id: number): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async searchItems(query: string): Promise<Item[]> {
    if (!query) {
      return this.getItems();
    }
    
    const lowercaseQuery = query.toLowerCase();
    
    return Array.from(this.items.values())
      .filter(item => !item.isReturned && 
        (item.name.toLowerCase().includes(lowercaseQuery) || 
         item.description.toLowerCase().includes(lowercaseQuery) || 
         item.location.toLowerCase().includes(lowercaseQuery)))
      .sort((a, b) => (b.dateCreated?.getTime() || 0) - (a.dateCreated?.getTime() || 0));
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const id = this.currentId++;
    const now = new Date();
    
    const item: Item = { 
      ...insertItem, 
      id, 
      isReturned: false, 
      dateCreated: now
    };
    
    this.items.set(id, item);
    return item;
  }

  async markItemAsReturned(id: number): Promise<Item | undefined> {
    const item = this.items.get(id);
    
    if (item) {
      const updatedItem = { ...item, isReturned: true };
      this.items.set(id, updatedItem);
      return updatedItem;
    }
    
    return undefined;
  }
}

export const storage = new MemStorage();
