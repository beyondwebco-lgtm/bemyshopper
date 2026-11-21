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
    device: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (!user) {
      await ctx.db.insert("userLogins", {
        email: cleanEmail,
        timestamp: Date.now(),
        status: "failed",
        failureReason: "Account not found",
        device: args.device || "Browser Session",
      });
      throw new Error("No account found with this email. Please sign up.");
    }

    if (user.isBlocked) {
      await ctx.db.insert("userLogins", {
        userId: user._id,
        email: cleanEmail,
        timestamp: Date.now(),
        status: "blocked",
        failureReason: "Account suspended by administrator",
        device: args.device || "Browser Session",
      });
      throw new Error("Your account has been suspended by the store administrator. Please contact support.");
    }

    if (user.password !== args.password) {
      await ctx.db.insert("userLogins", {
        userId: user._id,
        email: cleanEmail,
        timestamp: Date.now(),
        status: "failed",
        failureReason: "Incorrect password",
        device: args.device || "Browser Session",
      });
      throw new Error("Incorrect password. Please try again.");
    }

    const now = Date.now();
    const newCount = (user.loginCount || 0) + 1;
    await ctx.db.patch(user._id, {
      lastLoginAt: now,
      loginCount: newCount,
      updatedAt: now,
    });

    await ctx.db.insert("userLogins", {
      userId: user._id,
      email: cleanEmail,
      timestamp: now,
      status: "success",
      device: args.device || "Browser Session",
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
      lastLoginAt: now,
      loginCount: newCount,
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
      isBlocked: !!user.isBlocked,
      lastLoginAt: user.lastLoginAt,
      loginCount: user.loginCount || 0,
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

    const updates: Partial<{ name: string; phone: string; address: string; updatedAt: number }> = {
      updatedAt: Date.now(),
    };
    if (args.name !== undefined) updates.name = args.name.trim();
    if (args.phone !== undefined) updates.phone = args.phone.trim();
    if (args.address !== undefined) updates.address = args.address.trim();

    await ctx.db.patch(args.userId, updates);
    return await ctx.db.get(args.userId);
  },
});

// List all registered users (for admin panel) with full login data
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
      password: u.password,
      isBlocked: !!u.isBlocked,
      lastLoginAt: u.lastLoginAt,
      loginCount: u.loginCount || 0,
      notes: u.notes,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
  },
});

// List customer login history & session audits
export const listLoginHistory = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const logs = await ctx.db
      .query("userLogins")
      .order("desc")
      .take(limit);
    return logs;
  },
});

// Admin: Update Customer Profile Details
export const adminUpdateUser = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("user"))),
    isBlocked: v.optional(v.boolean()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("Customer account not found");

    const updates: Record<string, any> = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name.trim();
    if (args.email !== undefined) updates.email = args.email.trim().toLowerCase();
    if (args.phone !== undefined) updates.phone = args.phone.trim();
    if (args.address !== undefined) updates.address = args.address.trim();
    if (args.role !== undefined) updates.role = args.role;
    if (args.isBlocked !== undefined) updates.isBlocked = args.isBlocked;
    if (args.notes !== undefined) updates.notes = args.notes.trim();

    await ctx.db.patch(args.userId, updates);
    return { success: true };
  },
});

// Admin: Directly View / Change Customer Password
export const adminSetCustomerPassword = mutation({
  args: {
    userId: v.id("users"),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.newPassword || args.newPassword.length < 4) {
      throw new Error("Password must be at least 4 characters long");
    }
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("Customer not found");

    await ctx.db.patch(args.userId, {
      password: args.newPassword,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

// Admin: Toggle Customer Account Block / Active Status
export const adminToggleBlock = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("Customer not found");

    const nextState = !user.isBlocked;
    await ctx.db.patch(args.userId, {
      isBlocked: nextState,
      updatedAt: Date.now(),
    });
    return { success: true, isBlocked: nextState };
  },
});

// Admin: Delete Customer Account
export const adminDeleteUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("Customer not found");

    await ctx.db.delete(args.userId);
    return { success: true };
  },
});

// Admin: Manually Add New Customer
export const adminCreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("user"))),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (existing) {
      throw new Error("An account with this email already exists.");
    }

    const userId = await ctx.db.insert("users", {
      name: args.name.trim(),
      email: cleanEmail,
      password: args.password,
      phone: args.phone?.trim(),
      address: args.address?.trim(),
      role: args.role ?? "user",
      isBlocked: false,
      loginCount: 0,
      notes: args.notes?.trim(),
      createdAt: Date.now(),
    });

    return userId;
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

