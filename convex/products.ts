import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// The 12 Top Essentials directly mapped to customer categories and live Cloudflare R2 images
export const DEFAULT_TOP_ESSENTIALS = [
  {
    name: "Surf Excel Detergent Powder",
    category: "cleaning",
    price: 349,
    originalPrice: 399,
    weight: "1 kg",
    image: "/api/storage/products/prod-surf-excel.png",
    inStock: true,
    isPopular: true,
    isTopEssential: true,
    badgeText: "Bestseller",
    badgeIcon: "👑",
    badgeColor: "bg-[#48BB78] text-white",
    discount: "Save 13%",
    displayOrder: 1,
  },
  {
    name: "Vim Dishwash Liquid",
    category: "cleaning",
    price: 135,
    originalPrice: 145,
    weight: "750 ml",
    image: "/api/storage/products/prod-vim-dishwash.png",
    inStock: true,
    isPopular: false,
    isTopEssential: true,
    discount: "Save 7%",
    displayOrder: 2,
  },
  {
    name: "Ambica Durbar Bathi (Agarbathi)",
    category: "puja-items",
    price: 89,
    originalPrice: 99,
    weight: "Pack of 5",
    image: "/api/storage/products/prod-ambica-agarbatti.png",
    inStock: true,
    isPopular: false,
    isTopEssential: true,
    discount: "Save 10%",
    displayOrder: 3,
  },
  {
    name: "Rice",
    category: "groceries",
    price: 329,
    originalPrice: 349,
    weight: "5 kg",
    image: "/api/storage/products/prod-rice-5kg.png",
    inStock: true,
    isPopular: true,
    isTopEssential: true,
    discount: "Save 6%",
    displayOrder: 4,
  },
  {
    name: "Toilet Tissue Roll (3 Ply)",
    category: "paper",
    price: 149,
    originalPrice: 165,
    weight: "Pack of 4",
    image: "/api/storage/products/prod-toilet-tissue.png",
    inStock: true,
    isPopular: false,
    isTopEssential: true,
    discount: "Save 10%",
    displayOrder: 5,
  },
  {
    name: "Nandini Ghee",
    category: "home-kitchen",
    price: 289,
    originalPrice: 320,
    weight: "500 ml",
    image: "/api/storage/products/prod-nandini-ghee.png",
    inStock: true,
    isPopular: true,
    isTopEssential: true,
    badgeText: "Trending",
    badgeIcon: "🔥",
    badgeColor: "bg-[#FED7AA] text-[#C2410C]",
    discount: "Save 10%",
    displayOrder: 6,
  },
  {
    name: "Brooke Bond Red Label Tea",
    category: "home-kitchen",
    price: 299,
    originalPrice: 335,
    weight: "500 g",
    image: "/api/storage/products/prod-red-label.png",
    inStock: true,
    isPopular: true,
    isTopEssential: true,
    badgeText: "Bestseller",
    badgeIcon: "👑",
    badgeColor: "bg-[#48BB78] text-white",
    discount: "Save 11%",
    displayOrder: 7,
  },
  {
    name: "Maggi 2-Minute Noodles",
    category: "home-kitchen",
    price: 115,
    originalPrice: 125,
    weight: "420 g (Pack of 4)",
    image: "/api/storage/products/prod-maggi.png",
    inStock: true,
    isPopular: false,
    isTopEssential: true,
    discount: "Save 8%",
    displayOrder: 8,
  },
  {
    name: "Horlicks Health Drink",
    category: "home-kitchen",
    price: 329,
    originalPrice: 360,
    weight: "500 g",
    image: "/api/storage/products/prod-horlicks.png",
    inStock: true,
    isPopular: false,
    isTopEssential: true,
    discount: "Save 9%",
    displayOrder: 9,
  },
  {
    name: "Dove Beauty Bathing Bar",
    category: "personal-care",
    price: 165,
    originalPrice: 195,
    weight: "125 g (Pack of 3)",
    image: "/api/storage/products/prod-dove-soap.png",
    inStock: true,
    isPopular: false,
    isTopEssential: true,
    discount: "Save 15%",
    displayOrder: 10,
  },
  {
    name: "Colgate Strong Teeth Toothpaste",
    category: "personal-care",
    price: 129,
    originalPrice: 145,
    weight: "150 g",
    image: "/api/storage/products/prod-colgate.png",
    inStock: true,
    isPopular: false,
    isTopEssential: true,
    discount: "Save 11%",
    displayOrder: 11,
  },
  {
    name: "Harpic Power Plus Toilet Cleaner",
    category: "cleaning",
    price: 189,
    originalPrice: 210,
    weight: "1 L",
    image: "/api/storage/products/prod-harpic.png",
    inStock: true,
    isPopular: true,
    isTopEssential: true,
    badgeText: "Trending",
    badgeIcon: "🔥",
    badgeColor: "bg-[#FED7AA] text-[#C2410C]",
    discount: "Save 10%",
    displayOrder: 12,
  },
];

// List all products, optionally filtered by category
export const list = query({
  args: {
    category: v.optional(v.string()),
    inStockOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let products = await ctx.db.query("products").collect();

    if (args.category && args.category !== "all") {
      products = products.filter((p) => p.category === args.category);
    }

    if (args.inStockOnly) {
      products = products.filter((p) => p.inStock);
    }

    products.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
    return products;
  },
});

// List all Top Essentials ordered by displayOrder
export const listTopEssentials = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_top_essential", (q) => q.eq("isTopEssential", true))
      .collect();

    products.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
    return products;
  },
});

// Add a new product or Top Essential (Admin)
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
    isTopEssential: v.optional(v.boolean()),
    isOffer: v.optional(v.boolean()),
    badgeText: v.optional(v.string()),
    badgeIcon: v.optional(v.string()),
    badgeColor: v.optional(v.string()),
    discount: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", {
      ...args,
      rating: 4.8,
      createdAt: Date.now(),
    });
  },
});

// Update an existing product or Top Essential (Admin)
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
    isTopEssential: v.optional(v.boolean()),
    isOffer: v.optional(v.boolean()),
    badgeText: v.optional(v.string()),
    badgeIcon: v.optional(v.string()),
    badgeColor: v.optional(v.string()),
    discount: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return await ctx.db.get(id);
  },
});

// Update product / top essential photo (Admin)
export const updatePhoto = mutation({
  args: {
    id: v.id("products"),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { image: args.image });
    return await ctx.db.get(args.id);
  },
});

// Remove product / top essential photo (Admin)
export const removePhoto = mutation({
  args: {
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { image: "" });
    return await ctx.db.get(args.id);
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

// Delete a product / Top Essential (Admin)
export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Sync / Seed Top Essentials into database
export const syncTopEssentials = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").collect();
    let updatedCount = 0;
    let insertedCount = 0;

    for (const def of DEFAULT_TOP_ESSENTIALS) {
      // Find matching item by name or partial name
      const found = existing.find(
        (p) =>
          p.name.toLowerCase().trim() === def.name.toLowerCase().trim() ||
          p.image.includes(def.image.split("/").pop() || "")
      );

      if (found) {
        await ctx.db.patch(found._id, {
          category: def.category,
          price: def.price,
          originalPrice: def.originalPrice,
          weight: def.weight,
          image: def.image,
          inStock: true,
          isTopEssential: true,
          badgeText: def.badgeText,
          badgeIcon: def.badgeIcon,
          badgeColor: def.badgeColor,
          discount: def.discount,
          displayOrder: def.displayOrder,
        });
        updatedCount++;
      } else {
        await ctx.db.insert("products", {
          ...def,
          rating: 4.8,
          createdAt: Date.now(),
        });
        insertedCount++;
      }
    }

    return {
      message: `Synced ${DEFAULT_TOP_ESSENTIALS.length} Top Essentials (updated ${updatedCount}, inserted ${insertedCount})`,
      count: DEFAULT_TOP_ESSENTIALS.length,
    };
  },
});

// Seed default catalog if database is empty
export const seedDefaultProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) return { message: "Products already exist", count: 0 };

    for (const item of DEFAULT_TOP_ESSENTIALS) {
      await ctx.db.insert("products", {
        ...item,
        rating: 4.8,
        createdAt: Date.now(),
      });
    }

    return { message: "Seeded products successfully", count: DEFAULT_TOP_ESSENTIALS.length };
  },
});
