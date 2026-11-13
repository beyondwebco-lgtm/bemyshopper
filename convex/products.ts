import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// List all products, optionally filtered by category
export const list = query({
  args: {
    category: v.optional(v.string()),
    inStockOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("products");

    if (args.category && args.category !== "all") {
      const cat = args.category;
      const products = await ctx.db
        .query("products")
        .withIndex("by_category", (idx) => idx.eq("category", cat))
        .collect();
      return args.inStockOnly ? products.filter((p) => p.inStock) : products;
    }

    const all = await q.order("desc").collect();
    return args.inStockOnly ? all.filter((p) => p.inStock) : all;
  },
});

// Add a new product (Admin)
export const create = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    weight: v.string(),
    image: v.string(),
    inStock: v.boolean(),
    isPopular: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", {
      ...args,
      rating: 4.8,
      createdAt: Date.now(),
    });
  },
});

// Update an existing product (Admin)
export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    price: v.optional(v.number()),
    originalPrice: v.optional(v.number()),
    weight: v.optional(v.string()),
    image: v.optional(v.string()),
    inStock: v.optional(v.boolean()),
    isPopular: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return await ctx.db.get(id);
  },
});

// Toggle In-Stock / Out-of-Stock quickly (Admin)
export const toggleStock = mutation({
  args: {
    id: v.id("products"),
    inStock: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { inStock: args.inStock });
    return await ctx.db.get(args.id);
  },
});

// Delete a product (Admin)
export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Seed default catalog if database is empty
export const seedDefaultProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) return { message: "Products already seeded", count: 0 };

    const initial = [
      {
        name: "Ambica Durbar Bathi Agarbatti",
        category: "pooja-items",
        price: 45,
        originalPrice: 50,
        weight: "1 pack",
        image: "/images/prod-ambica-agarbatti.png",
        inStock: true,
        rating: 4.9,
        isPopular: true,
      },
      {
        name: "Pure Cow Ghee (Nandini / Local)",
        category: "pooja-items",
        price: 285,
        originalPrice: 320,
        weight: "500ml",
        image: "/images/prod-nandini-ghee.png",
        inStock: true,
        rating: 4.9,
        isPopular: true,
      },
      {
        name: "Kurnool Sona Masoori Rice Bag",
        category: "groceries",
        price: 340,
        originalPrice: 390,
        weight: "5 kg",
        image: "/images/prod-rice-5kg.png",
        inStock: true,
        rating: 4.8,
        isPopular: true,
      },
      {
        name: "Surf Excel Easy Wash Detergent",
        category: "cleaning-essentials",
        price: 135,
        originalPrice: 155,
        weight: "1 kg",
        image: "/images/prod-surf-excel.png",
        inStock: true,
        rating: 4.8,
        isPopular: true,
      },
      {
        name: "Vim Dishwash Gel Bottle",
        category: "cleaning-essentials",
        price: 105,
        originalPrice: 125,
        weight: "750 ml",
        image: "/images/prod-vim-dishwash.png",
        inStock: true,
        rating: 4.7,
        isPopular: false,
      },
      {
        name: "Dove Cream Beauty Bathing Bar",
        category: "personal-care",
        price: 58,
        originalPrice: 65,
        weight: "100g",
        image: "/images/prod-dove-soap.png",
        inStock: true,
        rating: 4.8,
        isPopular: false,
      },
      {
        name: "Colgate Strong Teeth Toothpaste",
        category: "personal-care",
        price: 95,
        originalPrice: 110,
        weight: "200g",
        image: "/images/prod-colgate.png",
        inStock: true,
        rating: 4.7,
        isPopular: false,
      },
      {
        name: "Maggi 2-Minute Masala Noodles",
        category: "snacks-beverages",
        price: 84,
        originalPrice: 96,
        weight: "4-pack",
        image: "/images/prod-maggi.png",
        inStock: true,
        rating: 4.9,
        isPopular: true,
      },
      {
        name: "Brooke Bond Red Label Strong Tea",
        category: "snacks-beverages",
        price: 140,
        originalPrice: 160,
        weight: "250g",
        image: "/images/prod-red-label.png",
        inStock: true,
        rating: 4.8,
        isPopular: false,
      },
      {
        name: "Harpic Power Plus Toilet Cleaner",
        category: "cleaning-essentials",
        price: 95,
        originalPrice: 110,
        weight: "500ml",
        image: "/images/prod-harpic.png",
        inStock: true,
        rating: 4.8,
        isPopular: false,
      },
    ];

    for (const item of initial) {
      await ctx.db.insert("products", {
        ...item,
        createdAt: Date.now(),
      });
    }

    return { message: "Seeded products successfully", count: initial.length };
  },
});

