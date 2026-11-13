import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const HOME_DEFAULT_CATEGORIES = [
  {
    name: "Groceries",
    slug: "groceries",
    image: "/api/storage/categories/cat-prod-groceries.png",
    bgGradient: "from-[#FFF8E7] via-[#FFF3D6] to-[#FFEEC4]",
    borderColor: "border-amber-200/60",
    description: "Rice, dal, pulses, cooking oils, flours, grains, and kitchen essentials",
    displayOrder: 1,
  },
  {
    name: "Fruits & Vegetables",
    slug: "fruits-veg",
    image: "/api/storage/categories/cat-prod-fruits-veg.png",
    bgGradient: "from-[#EBF7EE] via-[#DCF6E2] to-[#CEF2D6]",
    borderColor: "border-emerald-200/60",
    description: "Farm fresh fruits, crisp seasonal vegetables, and daily greens",
    displayOrder: 2,
  },
  {
    name: "Puja Items",
    slug: "puja-items",
    image: "/api/storage/categories/cat-prod-puja-items.png",
    bgGradient: "from-[#FFF4EA] via-[#FFEAD9] to-[#FFDEC4]",
    borderColor: "border-orange-200/60",
    description: "Ghee diyas, camphor, pooja oil, agarbatti, kumkum, and sacred essentials",
    displayOrder: 3,
  },
  {
    name: "Cleaning Essentials",
    slug: "cleaning",
    image: "/api/storage/categories/cat-prod-cleaning.png",
    bgGradient: "from-[#EDF6FF] via-[#DBEEFF] to-[#C9E4FF]",
    borderColor: "border-blue-200/60",
    description: "Detergent powder, dishwash liquids, surface cleaners, and home hygiene",
    displayOrder: 4,
  },
  {
    name: "Personal Care",
    slug: "personal-care",
    image: "/api/storage/categories/cat-prod-personal-care.png",
    bgGradient: "from-[#F7EFFF] via-[#EFE2FF] to-[#E5D2FF]",
    borderColor: "border-purple-200/60",
    description: "Bathing soaps, hair care, shampoos, dental care, and body hygiene",
    displayOrder: 5,
  },
  {
    name: "Snacks & Beverages",
    slug: "snacks",
    image: "/api/storage/categories/cat-prod-snacks.png",
    bgGradient: "from-[#FFF8ED] via-[#FFEECF] to-[#FFE3AF]",
    borderColor: "border-amber-200/60",
    description: "Tea, filter coffee, biscuits, roasted snacks, cold drinks, and juices",
    displayOrder: 6,
  },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    image: "/api/storage/categories/cat-prod-home-kitchen.png",
    bgGradient: "from-[#EFF6FF] via-[#E2EDFF] to-[#D0E2FF]",
    borderColor: "border-indigo-200/60",
    description: "Kitchen storage, cookware, dining essentials, and utility accessories",
    displayOrder: 7,
  },
  {
    name: "Paper & Disposables",
    slug: "paper",
    image: "/api/storage/categories/cat-prod-paper.png",
    bgGradient: "from-[#EDFAF1] via-[#DCF5E4] to-[#C8EFD3]",
    borderColor: "border-emerald-200/60",
    description: "Paper napkins, tissue rolls, aluminium foil, and disposable party items",
    displayOrder: 8,
  },
  {
    name: "Baby Care",
    slug: "baby-care",
    image: "/api/storage/categories/cat-prod-baby-care.png",
    bgGradient: "from-[#FFF0F4] via-[#FFE0E8] to-[#FFD0DC]",
    borderColor: "border-rose-200/60",
    description: "Gentle baby wipes, diapers, baby wash, and child nutrition essentials",
    displayOrder: 9,
  },
  {
    name: "More",
    slug: "more",
    image: "/api/storage/categories/cat-prod-more.png",
    bgGradient: "from-[#F7EFFF] via-[#ECE0FC] to-[#DFCEFA]",
    borderColor: "border-purple-200/60",
    description: "Specialty collections, local regional products, and seasonal items",
    displayOrder: 10,
  },
];

// List all categories with their product count
export const list = query({
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    const products = await ctx.db.query("products").collect();

    // Calculate product counts per category slug
    const countMap: Record<string, number> = {};
    for (const p of products) {
      countMap[p.category] = (countMap[p.category] || 0) + 1;
    }

    // Sort by displayOrder if present, else by createdAt
    categories.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

    return categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      bgGradient: cat.bgGradient || "from-[#F7F9F5] via-[#EFF5EE] to-[#E2EFE1]",
      borderColor: cat.borderColor || "border-emerald-200/60",
      displayOrder: cat.displayOrder,
      productCount: countMap[cat.slug] || 0,
      createdAt: cat.createdAt,
    }));
  },
});

// Create a new category
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    bgGradient: v.optional(v.string()),
    borderColor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanName = args.name.trim();
    if (!cleanName) {
      throw new Error("Category name is required.");
    }

    const slug = (args.slug?.trim() || cleanName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existing = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (existing) {
      throw new Error(`A category with slug "${slug}" already exists.`);
    }

    const categoryId = await ctx.db.insert("categories", {
      name: cleanName,
      slug,
      description: args.description?.trim(),
      image: args.image?.trim(),
      bgGradient: args.bgGradient || "from-[#F7F9F5] via-[#EFF5EE] to-[#E2EFE1]",
      borderColor: args.borderColor || "border-emerald-200/60",
      displayOrder: Date.now(),
      createdAt: Date.now(),
    });

    return { success: true, categoryId, slug };
  },
});

// 1. Edit Category (Name, Slug, Description, Image)
export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Category not found.");
    }

    const cleanName = args.name.trim();
    if (!cleanName) {
      throw new Error("Category name cannot be empty.");
    }

    const cleanSlug = args.slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check slug collision
    if (cleanSlug !== existing.slug) {
      const collision = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", cleanSlug))
        .first();
      if (collision && collision._id !== args.id) {
        throw new Error(`A category with slug "${cleanSlug}" already exists.`);
      }
    }

    await ctx.db.patch(args.id, {
      name: cleanName,
      slug: cleanSlug,
      description: args.description?.trim(),
      image: args.image !== undefined ? args.image.trim() : existing.image,
    });

    return { success: true, message: `Category "${cleanName}" updated successfully.` };
  },
});

// 2. Add / Update Photo
export const updatePhoto = mutation({
  args: {
    id: v.id("categories"),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Category not found.");
    }

    await ctx.db.patch(args.id, {
      image: args.image.trim(),
    });

    return { success: true, message: `Photo updated for "${existing.name}".` };
  },
});

// 3. Remove Photo
export const removePhoto = mutation({
  args: {
    id: v.id("categories"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Category not found.");
    }

    await ctx.db.patch(args.id, {
      image: "",
    });

    return { success: true, message: `Photo removed from "${existing.name}".` };
  },
});

// 4. Remove Category
export const remove = mutation({
  args: {
    id: v.id("categories"),
  },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.id);
    if (!category) {
      throw new Error("Category not found.");
    }

    await ctx.db.delete(args.id);
    return { success: true, message: `Category "${category.name}" deleted.` };
  },
});

// Sync / Reset to exact Home Page Categories
export const syncWithHomePage = mutation({
  handler: async (ctx) => {
    // Collect all existing categories
    const existing = await ctx.db.query("categories").collect();
    for (const cat of existing) {
      await ctx.db.delete(cat._id);
    }

    // Insert the 10 exact home page categories
    for (const cat of HOME_DEFAULT_CATEGORIES) {
      await ctx.db.insert("categories", {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        bgGradient: cat.bgGradient,
        borderColor: cat.borderColor,
        displayOrder: cat.displayOrder,
        createdAt: Date.now(),
      });
    }

    return {
      success: true,
      message: `Reset complete! Synced ${HOME_DEFAULT_CATEGORIES.length} categories from home page.`,
    };
  },
});

// Seed default categories if empty (uses the 10 home page categories)
export const seedDefaultCategories = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("categories").first();
    if (existing) {
      return { success: false, message: "Categories already exist." };
    }

    for (const cat of HOME_DEFAULT_CATEGORIES) {
      await ctx.db.insert("categories", {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        bgGradient: cat.bgGradient,
        borderColor: cat.borderColor,
        displayOrder: cat.displayOrder,
        createdAt: Date.now(),
      });
    }

    return {
      success: true,
      message: `Initialized ${HOME_DEFAULT_CATEGORIES.length} default categories from home page!`,
    };
  },
});
