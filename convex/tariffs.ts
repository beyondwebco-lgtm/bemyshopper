import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get rental tariffs
export const getTariffs = query({
  args: {},
  handler: async (ctx) => {
    const list = await ctx.db.query("rentalTariffs").collect();
    return list;
  },
});

// Update or insert rental tariff
export const updateTariff = mutation({
  args: {
    category: v.union(v.literal("5-seater"), v.literal("7-seater")),
    title: v.string(),
    subtitle: v.string(),
    tag: v.string(),
    passengers: v.string(),
    image: v.optional(v.string()),
    plans: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("rentalTariffs")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        title: args.title,
        subtitle: args.subtitle,
        tag: args.tag,
        passengers: args.passengers,
        image: args.image,
        plans: args.plans,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("rentalTariffs", {
        category: args.category,
        title: args.title,
        subtitle: args.subtitle,
        tag: args.tag,
        passengers: args.passengers,
        image: args.image,
        plans: args.plans,
        updatedAt: Date.now(),
      });
    }
  },
});
