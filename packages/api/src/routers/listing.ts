
import { desc } from "drizzle-orm";
import { listing } from "@myrehat-task-b/db/schema/index";

import { protectedProcedure, publicProcedure } from "../index";
import { createListingSchema } from "../listing-validation";

export const listingRouter = {
  list: publicProcedure.handler(async ({ context }) => {
    return context.db
      .select()
      .from(listing)
      .orderBy(desc(listing.createdAt));
  }),

  create: protectedProcedure
    .input(createListingSchema)
    .handler(async ({ context, input }) => {
      const [created] = await context.db
        .insert(listing)
        .values({
          id: crypto.randomUUID(),
          title: input.title,
          price: input.price.toString(),
          location: input.location,
          category: input.category,
          contactWa: input.contactWa,
        })
        .returning();

      if (!created) {
        throw new Error("Failed to create listing");
      }

      return created;
    }),
};
