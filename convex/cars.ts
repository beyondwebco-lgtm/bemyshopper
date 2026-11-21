import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// List all rental cars
export const list = query({
  args: {
    category: v.optional(v.union(v.literal("5-seater"), v.literal("7-seater"))),
    availableOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let cars = await ctx.db.query("cars").order("desc").collect();
    if (args.category) {
      cars = cars.filter((c) => c.category === args.category);
    }
    if (args.availableOnly) {
      cars = cars.filter((c) => c.isAvailable);
    }
    return cars;
  },
});

// Create new rental car
export const create = mutation({
  args: {
    name: v.string(),
    category: v.union(v.literal("5-seater"), v.literal("7-seater")),
    categoryLabel: v.optional(v.string()),
    tag: v.optional(v.string()),
    tagColor: v.optional(v.string()),
    images: v.array(v.string()),
    description: v.optional(v.string()),
    specs: v.optional(
      v.object({
        seats: v.string(),
        transmission: v.string(),
        fuel: v.string(),
        mileage: v.string(),
      })
    ),
    features: v.optional(v.array(v.string())),
    plans: v.optional(v.any()),
    isAvailable: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("cars", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Update rental car
export const update = mutation({
  args: {
    id: v.id("cars"),
    name: v.string(),
    category: v.union(v.literal("5-seater"), v.literal("7-seater")),
    categoryLabel: v.optional(v.string()),
    tag: v.optional(v.string()),
    tagColor: v.optional(v.string()),
    images: v.array(v.string()),
    description: v.optional(v.string()),
    specs: v.optional(
      v.object({
        seats: v.string(),
        transmission: v.string(),
        fuel: v.string(),
        mileage: v.string(),
      })
    ),
    features: v.optional(v.array(v.string())),
    plans: v.optional(v.any()),
    isAvailable: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, {
      ...data,
      updatedAt: Date.now(),
    });
    return id;
  },
});

// Toggle car availability
export const toggleAvailability = mutation({
  args: {
    id: v.id("cars"),
  },
  handler: async (ctx, args) => {
    const car = await ctx.db.get(args.id);
    if (!car) throw new Error("Car not found");
    await ctx.db.patch(args.id, {
      isAvailable: !car.isAvailable,
      updatedAt: Date.now(),
    });
    return !car.isAvailable;
  },
});

// Remove car
export const remove = mutation({
  args: {
    id: v.id("cars"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});
