import z from "zod";

export const geolocationDataSchema = z.object({
  ip: z.string(),
  hostname: z.string(),
  city: z.string(),
  region: z.string(),
  country: z.string(),
  loc: z.string(),
  org: z.string(),
  postal: z.string(),
  timezone: z.string(),
});

export const uuidSchema = z.uuidv4();

export const uuidArraySchema = z.array(z.uuidv4());
