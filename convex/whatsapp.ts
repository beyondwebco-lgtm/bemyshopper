import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// List all store WhatsApp order numbers
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("whatsappSettings").order("desc").collect();
  },
});

// Get the currently active WhatsApp number for receiving cart orders
export const getActive = query({
  args: {},
  handler: async (ctx) => {
    const active = await ctx.db
      .query("whatsappSettings")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .first();

    if (active) return active.phone;

    // Fallback: check any first configured number or default
    const anyNum = await ctx.db.query("whatsappSettings").first();
    return anyNum ? anyNum.phone : "919999999999";
  },
});

// Add a new WhatsApp number
export const add = mutation({
  args: {
    phone: v.string(),
    label: v.string(),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const rawDigits = args.phone.trim().replace(/[^0-9]/g, "");
    if (rawDigits.length < 10) {
      throw new Error("Please enter a valid 10-digit mobile number");
    }
    const formattedPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;

    const shouldBeActive = args.isActive ?? true;

    // If new number is active, deactivate others
    if (shouldBeActive) {
      const allNumbers = await ctx.db.query("whatsappSettings").collect();
      for (const num of allNumbers) {
        if (num.isActive) {
          await ctx.db.patch(num._id, { isActive: false });
        }
      }
    }

    return await ctx.db.insert("whatsappSettings", {
      phone: formattedPhone,
      label: args.label.trim() || "Store Orders Desk",
      isActive: shouldBeActive,
      createdAt: Date.now(),
    });
  },
});

// Set a WhatsApp number as active
export const setActive = mutation({
  args: {
    id: v.id("whatsappSettings"),
  },
  handler: async (ctx, args) => {
    const allNumbers = await ctx.db.query("whatsappSettings").collect();
    for (const num of allNumbers) {
      await ctx.db.patch(num._id, { isActive: num._id === args.id });
    }
    return true;
  },
});

// Delete a WhatsApp number
export const remove = mutation({
  args: {
    id: v.id("whatsappSettings"),
  },
  handler: async (ctx, args) => {
    const target = await ctx.db.get(args.id);
    if (!target) throw new Error("Number not found");

    await ctx.db.delete(args.id);

    // If deleted number was active, activate another remaining number
    if (target.isActive) {
      const remaining = await ctx.db.query("whatsappSettings").first();
      if (remaining) {
        await ctx.db.patch(remaining._id, { isActive: true });
      }
    }
    return true;
  },
});
