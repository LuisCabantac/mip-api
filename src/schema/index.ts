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
  asn: z.string(),
  as_name: z.string(),
  as_domain: z.string(),
  country_code: z.string(),
  continent_code: z.string(),
  continent: z.string(),
});

export const uuidSchema = z.uuidv4();

export const uuidArraySchema = z.array(z.uuidv4());
