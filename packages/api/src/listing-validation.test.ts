
import { describe, expect, it } from "vitest";

import {
  LISTING_CATEGORIES,
  createListingSchema,
} from "./listing-validation";

const validListing = {
  title: "Villa Homestay",
  price: 350000,
  location: "Kuala Lumpur",
  category: "Buy Property",
  contactWa: "60123456789",
};

describe("BuyHomestay Listing Validation", () => {
  it.each(LISTING_CATEGORIES)(
    "accepts category: %s",
    (category) => {
      const result = createListingSchema.safeParse({
        ...validListing,
        category,
      });

      expect(result.success).toBe(true);
    },
  );

  it("rejects an unknown category", () => {
    const result = createListingSchema.safeParse({
      ...validListing,
      category: "Rent Property",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a negative price", () => {
    const result = createListingSchema.safeParse({
      ...validListing,
      price: -100,
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty title", () => {
    const result = createListingSchema.safeParse({
      ...validListing,
      title: "",
    });

    expect(result.success).toBe(false);
  });
});
