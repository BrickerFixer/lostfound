import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Lost and found item schema
export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  dateFound: text("date_found").notNull(),
  additionalInfo: text("additional_info"),
  imageUrl: text("image_url").notNull(),
  finderName: text("finder_name").notNull(),
  finderPhone: text("finder_phone").notNull(),
  finderEmail: text("finder_email").notNull(),
  isReturned: boolean("is_returned").default(false).notNull(),
  dateCreated: timestamp("date_created").defaultNow().notNull(),
});

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// For now, we'll comment out the relations as they're not needed yet
// We can implement proper relations when we have user authentication
/*
export const usersRelations = relations(users, ({ many }) => ({
  items: many(items),
}));

export const itemsRelations = relations(items, ({ one }) => ({
  finder: one(users),
}));
*/

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  isReturned: true,
  dateCreated: true,
});

export const itemSearchSchema = z.object({
  query: z.string().optional(),
});

export const itemReturnSchema = z.object({
  id: z.number(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type Item = typeof items.$inferSelect;
export type ItemSearch = z.infer<typeof itemSearchSchema>;
export type ItemReturn = z.infer<typeof itemReturnSchema>;
