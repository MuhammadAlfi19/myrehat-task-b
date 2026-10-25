
import { z } from "zod";

export const LISTING_CATEGORIES = [
  "Buy Property",
  "Buy land to build homestay",
  "Buy Airbnb Profile",
  "Buy Airbnb Business",
] as const;

export const createListingSchema = z.object({
  title: z.string().trim().min(1).max(150),

  price: z
    .number()
    .positive()
    .finite(),

  location: z.string().trim().min(1).max(200),

  category: z.enum(LISTING_CATEGORIES),

  contactWa: z.string().trim().min(6).max(30),
});

export type CreateListingInput = z.infer<
  typeof createListingSchema
>;
