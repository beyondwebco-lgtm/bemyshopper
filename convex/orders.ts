import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new order (customer checkout)
export const createOrder = mutation({
  args: {
    userId: v.optional(v.id("users")),
    customerName: v.string(),
    customerPhone: v.string(),
    customerEmail: v.string(),
    deliveryAddress: v.string(),
    items: v.array(
      v.object({
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        weight: v.optional(v.string()),
        image: v.optional(v.string()),
      })
    ),
    totalAmount: v.number(),
    paymentMethod: v.string(),
  },
  handler: async (ctx, args) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `BMS-${Date.now().toString().slice(-4)}-${randomSuffix}`;

    const orderId = await ctx.db.insert("orders", {
      orderNumber,
      userId: args.userId,
      customerName: args.customerName.trim(),
      customerPhone: args.customerPhone.trim(),
      customerEmail: args.customerEmail.trim(),
      deliveryAddress: args.deliveryAddress.trim(),
      items: args.items,
      totalAmount: args.totalAmount,
      status: "pending",
      paymentMethod: args.paymentMethod,
      createdAt: Date.now(),
    });

    return { orderId, orderNumber };
  },
});

// List all orders (Admin Panel)
export const list = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.status && args.status !== "all") {
      const targetStatus = args.status as
        | "pending"
        | "confirmed"
        | "preparing"
        | "out_for_delivery"
        | "delivered"
        | "cancelled";
      return await ctx.db
        .query("orders")
        .withIndex("by_status", (idx) => idx.eq("status", targetStatus))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("orders").order("desc").collect();
  },
});

// List orders for a specific user
export const listUserOrders = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (idx) => idx.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Update order status (Admin)
export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("preparing"),
      v.literal("out_for_delivery"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
    return await ctx.db.get(args.id);
  },
});

// Dashboard metrics for Admin Panel
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    const rentals = await ctx.db.query("rentals").collect();
    const products = await ctx.db.query("products").collect();
    const users = await ctx.db.query("users").collect();

    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const pendingRentals = rentals.filter((r) => r.status === "new").length;
    const outOfStock = products.filter((p) => !p.inStock).length;

    return {
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      totalRentals: rentals.length,
      pendingRentals,
      totalProducts: products.length,
      outOfStock,
      totalUsers: users.length,
    };
  },
});

