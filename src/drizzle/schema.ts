import { json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const history = pgTable("history", {
  id: uuid("id").primaryKey().notNull(),
  userId: uuid("user_id")
    .references(() => user.id)
    .notNull(),
  geolocationData: json("geolocation_data")
    .$type<{
      ip: string;
      hostname: string;
      city: string;
      region: string;
      country: string;
      loc: string;
      org: string;
      postal: string;
      timezone: string;
    }>()
    .notNull(),
  createdAt: timestamp("created_at").notNull(),
});
