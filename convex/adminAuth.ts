import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const PRIMARY_ADMIN_EMAIL = "bemyshopper2021@gmail.com";

// Dedicated Admin Login (operates exclusively on the `admins` table)
export const adminLogin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();
    const cleanPassword = args.password.trim();

    // Only authorized administrator emails can access the admin table
    const isAuthorized =
      cleanEmail === PRIMARY_ADMIN_EMAIL ||
      cleanEmail === "neelamvishwa071@gmail.com" ||
      cleanEmail === "neelamviswanadh0001@gmail.com";

    if (!isAuthorized) {
      throw new Error("Access Denied: Only the official store administrator can access this portal.");
    }

    let admin = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    // If no admin record exists in `admins` table yet, initialize the primary admin
    if (!admin) {
      const defaultPassword = cleanEmail === PRIMARY_ADMIN_EMAIL ? (cleanPassword || "Admin@2026!") : cleanPassword;
      const adminId = await ctx.db.insert("admins", {
        name: "Store Administrator",
        email: cleanEmail,
        password: defaultPassword,
        createdAt: Date.now(),
      });
      return {
        id: adminId,
        name: "Store Administrator",
        email: cleanEmail,
        role: "admin" as const,
      };
    }

    // Verify admin password (trimmed, tolerant of Admin@2026! or admin@2026!)
    const isPasswordMatch =
      admin.password.trim() === cleanPassword ||
      (admin.password.toLowerCase() === cleanPassword.toLowerCase());

    if (!isPasswordMatch) {
      throw new Error("Incorrect administrator password.");
    }

    return {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: "admin" as const,
    };
  },
});

// Change Admin Password
export const changeAdminPassword = mutation({
  args: {
    email: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();

    const admin = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (!admin) {
      throw new Error("Administrator account not found.");
    }

    if (admin.password !== args.currentPassword) {
      throw new Error("Current password does not match.");
    }

    if (args.newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters long.");
    }

    await ctx.db.patch(admin._id, {
      password: args.newPassword,
      updatedAt: Date.now(),
    });

    return { success: true, message: "Admin password updated successfully!" };
  },
});

// Seed or update admin directly
export const setAdminCredentials = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();

    const existing = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        password: args.password,
        ...(args.name ? { name: args.name.trim() } : {}),
        updatedAt: Date.now(),
      });
      return { success: true, message: `Admin ${cleanEmail} password updated.` };
    } else {
      await ctx.db.insert("admins", {
        name: args.name?.trim() || "Store Administrator",
        email: cleanEmail,
        password: args.password,
        createdAt: Date.now(),
      });
      return { success: true, message: `Admin ${cleanEmail} initialized.` };
    }
  },
});

