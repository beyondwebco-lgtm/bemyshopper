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
    isBlocked: v.optional(v.boolean()),
    lastLoginAt: v.optional(v.number()),
    loginCount: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_email", ["email"]),

  // Customer Login History & Audits
  userLogins: defineTable({
    userId: v.optional(v.id("users")),
    email: v.string(),
    timestamp: v.number(),
    status: v.union(v.literal("success"), v.literal("failed"), v.literal("blocked")),
    failureReason: v.optional(v.string()),
    device: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_timestamp", ["timestamp"]),

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
    isTopEssential: v.optional(v.boolean()),
    isOffer: v.optional(v.boolean()),
    badgeText: v.optional(v.string()),
    badgeIcon: v.optional(v.string()),
    badgeColor: v.optional(v.string()),
    discount: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_in_stock", ["inStock"])
    .index("by_top_essential", ["isTopEssential"]),

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

  // Rental Fleet Cars with Multiple Photos
  cars: defineTable({
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
    displayOrder: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_category", ["category"])
    .index("by_available", ["isAvailable"]),

  // Rental Tariff Plans (for price changing feature)
  rentalTariffs: defineTable({
    category: v.union(v.literal("5-seater"), v.literal("7-seater")),
    title: v.string(),
    subtitle: v.string(),
    tag: v.string(),
    passengers: v.string(),
    image: v.optional(v.string()),
    plans: v.any(),
    updatedAt: v.optional(v.number()),
  }).index("by_category", ["category"]),

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

  // Store WhatsApp Order Routing Numbers
  whatsappSettings: defineTable({
    phone: v.string(),
    label: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_active", ["isActive"]),
});

