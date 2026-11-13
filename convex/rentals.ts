import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new car rental booking inquiry
export const createInquiry = mutation({
  args: {
    carType: v.union(v.literal("5-seater"), v.literal("7-seater")),
    duration: v.union(v.literal("6hr"), v.literal("12hr"), v.literal("24hr")),
    planPrice: v.string(),
    customerName: v.string(),
    customerPhone: v.string(),
    travelDate: v.string(),
    pickupLocation: v.string(),
  },
  handler: async (ctx, args) => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const inquiryNumber = `CAR-${Date.now().toString().slice(-4)}-${randomSuffix}`;

    const rentalId = await ctx.db.insert("rentals", {
      inquiryNumber,
      carType: args.carType,
      duration: args.duration,
      planPrice: args.planPrice,
      customerName: args.customerName.trim(),
      customerPhone: args.customerPhone.trim(),
      travelDate: args.travelDate.trim(),
      pickupLocation: args.pickupLocation.trim(),
      status: "new",
      createdAt: Date.now(),
    });

    return { rentalId, inquiryNumber };
  },
});

// List rental inquiries for Admin Panel
export const list = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.status && args.status !== "all") {
      const targetStatus = args.status as
        | "new"
        | "contacted"
        | "confirmed"
        | "completed"
        | "cancelled";
      return await ctx.db
        .query("rentals")
        .withIndex("by_status", (idx) => idx.eq("status", targetStatus))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("rentals").order("desc").collect();
  },
});

// Update rental inquiry status (Admin)
export const updateStatus = mutation({
  args: {
    id: v.id("rentals"),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
    return await ctx.db.get(args.id);
  },
});

