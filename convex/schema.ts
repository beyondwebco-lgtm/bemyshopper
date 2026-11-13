import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Dedicated Admins table (100% isolated from customer users)
  admins: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(),
    updatedAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // Users table for customer shoppers only
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(), // Securely stored password
    phone: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("user")),
    address: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  // Categories table (Managed by Admin, images on Cloudflare R2)
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    bgGradient: v.optional(v.string()),
    borderColor: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  // Products catalog managed by admin
  products: defineTable({
    name: v.string(),
    category: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    weight: v.string(),
    image: v.string(),
    inStock: v.boolean(),
    rating: v.optional(v.number()),
    isPopular: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_in_stock", ["inStock"]),

  // Orders placed by customers, managed by admin
  orders: defineTable({
    orderNumber: v.string(),
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
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("preparing"),
      v.literal("out_for_delivery"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    paymentMethod: v.string(),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_user", ["userId"]),

  // Car rental inquiries & bookings
  rentals: defineTable({
    inquiryNumber: v.string(),
    carType: v.union(v.literal("5-seater"), v.literal("7-seater")),
    duration: v.union(v.literal("6hr"), v.literal("12hr"), v.literal("24hr")),
    planPrice: v.string(),
    customerName: v.string(),
    customerPhone: v.string(),
    travelDate: v.string(),
    pickupLocation: v.string(),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("confirmed"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    createdAt: v.number(),
  }).index("by_status", ["status"]),

  // Password reset requests with secure hashed tokens
  passwordResets: defineTable({
    email: v.string(),
    tokenHash: v.optional(v.string()),
    code: v.optional(v.string()),
    expiresAt: v.number(),
    used: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_token_hash", ["tokenHash"])
    .index("by_email", ["email"]),
});

