import { json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const history = pgTable("history", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
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
      asn: string;
      as_name: string;
      as_domain: string;
      country_code: string;
      continent_code: string;
      continent: string;
    }>()
    .notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
