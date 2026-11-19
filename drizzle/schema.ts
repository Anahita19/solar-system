import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  address: text("address").notNull(),
  buildingType: varchar("buildingType", { length: 100 }).notNull(),
  monthlyBill: decimal("monthlyBill", { precision: 12, scale: 2 }).notNull(),
  systemKw: decimal("systemKw", { precision: 12, scale: 2 }).notNull(),
  annualSavings: decimal("annualSavings", { precision: 12, scale: 2 }).notNull(),
  paybackYears: decimal("paybackYears", { precision: 6, scale: 2 }).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  company: varchar("company", { length: 200 }).notNull(),
  role: varchar("role", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  consent: int("consent").notNull(),
  utmSource: varchar("utmSource", { length: 255 }),
  utmMedium: varchar("utmMedium", { length: 255 }),
  utmCampaign: varchar("utmCampaign", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Lead = typeof leads.$inferSelect;
