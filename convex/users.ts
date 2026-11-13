import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Register a new customer or admin
export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("user"))),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();

    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (existing) {
      throw new Error("An account with this email already exists. Please log in.");
    }

    // Designate first user or admin email as admin
    const isFirstUser = (await ctx.db.query("users").first()) === null;
    const isAdminEmail =
      cleanEmail.includes("admin") ||
      cleanEmail === "neelamviswanadh0001@gmail.com";
    const userRole = args.role ?? (isFirstUser || isAdminEmail ? "admin" : "user");

    const userId = await ctx.db.insert("users", {
      name: args.name.trim(),
      email: cleanEmail,
      password: args.password,
      phone: args.phone?.trim(),
      role: userRole,
      address: args.address?.trim(),
      createdAt: Date.now(),
    });

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Failed to create user");

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
    };
  },
});

// Dedicated Admin Login mutation (enforces strict admin-only access)
export const adminLogin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();

    const isDesignatedAdminEmail =
      cleanEmail === "bemyshopper2021@gmail.com" ||
      cleanEmail === "neelamviswanadh0001@gmail.com" ||
      cleanEmail === "neelamvishwa071@gmail.com" ||
      cleanEmail.startsWith("admin@");

    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    // If designated admin account doesn't exist yet, automatically initialize it
    if (!user && isDesignatedAdminEmail) {
      const userId = await ctx.db.insert("users", {
        name: "Store Administrator",
        email: cleanEmail,
        password: args.password,
        role: "admin",
        createdAt: Date.now(),
      });
      return {
        id: userId,
        name: "Store Administrator",
        email: cleanEmail,
        role: "admin" as const,
      };
    }

    if (!user) {
      throw new Error("No administrator account found with this email.");
    }

    if (user.password !== args.password) {
      throw new Error("Incorrect administrator password.");
    }

    const isAuthorizedAdmin =
      user.role === "admin" ||
      isDesignatedAdminEmail;

    if (!isAuthorizedAdmin) {
      throw new Error("Access Denied: This account does not have administrator privileges.");
    }

    if (user.role !== "admin") {
      await ctx.db.patch(user._id, { role: "admin" });
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: "admin" as const,
    };
  },
});

// Set or update admin email and password directly
export const setAdminAccount = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        password: args.password,
        role: "admin",
        ...(args.name ? { name: args.name.trim() } : {}),
      });
      return {
        success: true,
        message: `Admin account for ${cleanEmail} updated successfully with role: admin.`,
      };
    } else {
      await ctx.db.insert("users", {
        name: args.name?.trim() || "Store Administrator",
        email: cleanEmail,
        password: args.password,
        role: "admin",
        createdAt: Date.now(),
      });
      return {
        success: true,
        message: `New admin account for ${cleanEmail} created successfully with role: admin.`,
      };
    }
  },
});

// Login with email and password
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (!user) {
      throw new Error("No account found with this email. Please sign up.");
    }

    if (user.password !== args.password) {
      throw new Error("Incorrect password. Please try again.");
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
    };
  },
});

// Get user profile by ID
export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
      createdAt: user.createdAt,
    };
  },
});

// Update profile details
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const updates: Partial<{ name: string; phone: string; address: string }> = {};
    if (args.name !== undefined) updates.name = args.name.trim();
    if (args.phone !== undefined) updates.phone = args.phone.trim();
    if (args.address !== undefined) updates.address = args.address.trim();

    await ctx.db.patch(args.userId, updates);
    return await ctx.db.get(args.userId);
  },
});

// List all registered users (for admin panel)
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").order("desc").collect();
    return users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      address: u.address,
      createdAt: u.createdAt,
    }));
  },
});

// Request a password reset code
export const requestPasswordReset = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (!user) {
      throw new Error("No account found with this email address.");
    }

    // Generate a 6-digit secure numeric code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity

    await ctx.db.insert("passwordResets", {
      email: cleanEmail,
      code,
      expiresAt,
      used: false,
      createdAt: Date.now(),
    });

    return {
      success: true,
      email: cleanEmail,
      code,
      expiresInMinutes: 15,
    };
  },
});

// Verify reset code and update password
export const resetPassword = mutation({
  args: {
    email: v.string(),
    code: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();
    const cleanCode = args.code.trim();

    if (args.newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters.");
    }

    const record = await ctx.db
      .query("passwordResets")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .order("desc")
      .first();

    if (!record || record.used || record.code !== cleanCode) {
      throw new Error("Invalid verification code. Please check your email or request a new code.");
    }

    if (Date.now() > record.expiresAt) {
      throw new Error("This verification code has expired. Please request a new one.");
    }

    // Mark reset code as used
    await ctx.db.patch(record._id, { used: true });

    // Update password on user
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (!user) {
      throw new Error("User not found.");
    }

    await ctx.db.patch(user._id, { password: args.newPassword });

    return { success: true };
  },
});

