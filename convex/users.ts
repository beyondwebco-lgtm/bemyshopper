import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// The ONLY authorized administrator email in the entire system
export const PRIMARY_ADMIN_EMAIL = "bemyshopper2021@gmail.com";

// Register a new customer
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

    // STRICT: Only bemyshopper2021@gmail.com is ever an admin.
    // Every other user is strictly a customer.
    const userRole = cleanEmail === PRIMARY_ADMIN_EMAIL ? "admin" : "user";

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

// Dedicated Admin Login mutation (enforces strict single Store Administrator access)
export const adminLogin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();

    if (cleanEmail !== PRIMARY_ADMIN_EMAIL) {
      throw new Error("Access Denied: Only the official Store Administrator (bemyshopper2021@gmail.com) has admin privileges.");
    }

    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    // If designated admin account doesn't exist yet, automatically initialize it
    if (!user) {
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

    if (user.password !== args.password) {
      throw new Error("Incorrect administrator password.");
    }

    if (user.role !== "admin" || user.name !== "Store Administrator") {
      await ctx.db.patch(user._id, { role: "admin", name: "Store Administrator" });
    }

    return {
      id: user._id,
      name: "Store Administrator",
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

    if (cleanEmail !== PRIMARY_ADMIN_EMAIL) {
      throw new Error("Access Denied: Only bemyshopper2021@gmail.com can be configured as Store Administrator.");
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        password: args.password,
        role: "admin",
        name: "Store Administrator",
        updatedAt: Date.now(),
      });
      return {
        success: true,
        message: `Store Administrator (${cleanEmail}) updated successfully.`,
      };
    } else {
      await ctx.db.insert("users", {
        name: "Store Administrator",
        email: cleanEmail,
        password: args.password,
        role: "admin",
        createdAt: Date.now(),
      });
      return {
        success: true,
        message: `Store Administrator (${cleanEmail}) created successfully.`,
      };
    }
  },
});

// Login with email and password (customers or admin)
export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    device: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();

    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    // Fallback: Check if user entered registered phone number or has minor typo in email username
    if (!user) {
      const cleanDigits = cleanEmail.replace(/[^0-9]/g, "");
      const allUsers = await ctx.db.query("users").collect();

      // Check phone match
      if (cleanDigits.length >= 10) {
        user = allUsers.find((u) => {
          const uDigits = (u.phone || "").replace(/[^0-9]/g, "");
          return (uDigits.length >= 10 && uDigits.endsWith(cleanDigits.slice(-10))) ||
                 (cleanDigits.length >= 10 && cleanDigits.endsWith(uDigits.slice(-10)));
        }) || null;
      }

      // Check common email typo variation (e.g. viswandh vs viswanadh)
      if (!user && cleanEmail.includes("@")) {
        const [typedUser, typedDomain] = cleanEmail.split("@");
        const stripConsonants = (str: string) => str.replace(/[^a-z0-9]/g, "").replace(/[aeiou]/g, "");
        user = allUsers.find((u) => {
          if (!u.email.includes("@")) return false;
          const [dbUser, dbDomain] = u.email.toLowerCase().split("@");
          return dbDomain === typedDomain && stripConsonants(dbUser) === stripConsonants(typedUser);
        }) || null;
      }
    }

    if (!user) {
      await ctx.db.insert("userLogins", {
        email: cleanEmail,
        timestamp: Date.now(),
        status: "failed",
        failureReason: "Account not found",
        device: args.device || "Browser Session",
      });
      throw new Error("No account found with this email. Please check your spelling or click Create Account.");
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

    const updates: Record<string, any> = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name.trim();
    if (args.phone !== undefined) updates.phone = args.phone.trim();
    if (args.address !== undefined) updates.address = args.address.trim();

    await ctx.db.patch(args.userId, updates);
    return { success: true };
  },
});

// List all customers for Admin Management
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

// List login history records for audit
export const listLoginHistory = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;
    const logs = await ctx.db
      .query("userLogins")
      .withIndex("by_timestamp")
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

    // STRICT: Only Store Administrator has role "admin". All other accounts are strictly "user"
    if (user.email === PRIMARY_ADMIN_EMAIL) {
      updates.role = "admin";
    } else {
      updates.role = "user";
    }

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

    if (user.email === PRIMARY_ADMIN_EMAIL) {
      throw new Error("Cannot block the official Store Administrator account.");
    }

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

    if (user.email === PRIMARY_ADMIN_EMAIL) {
      throw new Error("Cannot delete the official Store Administrator account.");
    }

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

    // STRICT: Only bemyshopper2021@gmail.com is ever an admin.
    // All manually created accounts are strictly customers.
    const userRole = cleanEmail === PRIMARY_ADMIN_EMAIL ? "admin" : "user";

    const userId = await ctx.db.insert("users", {
      name: args.name.trim(),
      email: cleanEmail,
      password: args.password,
      phone: args.phone?.trim(),
      address: args.address?.trim(),
      role: userRole,
      isBlocked: false,
      loginCount: 0,
      notes: args.notes?.trim(),
      createdAt: Date.now(),
    });

    return userId;
  },
});

// Single Store Administrator Enforcer Mutation
// Sets bemyshopper2021@gmail.com as the ONLY admin in users and admins tables.
// Converts all other users to role: "user" (customer).
export const syncSingleStoreAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. In `users` table:
    const allUsers = await ctx.db.query("users").collect();
    let updatedUsers = 0;
    for (const u of allUsers) {
      if (u.email === PRIMARY_ADMIN_EMAIL) {
        if (u.role !== "admin" || u.name !== "Store Administrator") {
          await ctx.db.patch(u._id, { role: "admin", name: "Store Administrator" });
          updatedUsers++;
        }
      } else {
        if (u.role !== "user") {
          await ctx.db.patch(u._id, { role: "user" });
          updatedUsers++;
        }
      }
    }

    // 2. In `admins` table:
    const allAdmins = await ctx.db.query("admins").collect();
    let deletedAdmins = 0;
    for (const a of allAdmins) {
      if (a.email !== PRIMARY_ADMIN_EMAIL) {
        await ctx.db.delete(a._id);
        deletedAdmins++;
      }
    }

    // Ensure Store Administrator is present in `admins` table
    const storeAdmin = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", PRIMARY_ADMIN_EMAIL))
      .first();

    if (!storeAdmin) {
      await ctx.db.insert("admins", {
        name: "Store Administrator",
        email: PRIMARY_ADMIN_EMAIL,
        password: "Admin@2026!",
        createdAt: Date.now(),
      });
    }

    return {
      success: true,
      updatedUsers,
      deletedAdmins,
      primaryAdminEmail: PRIMARY_ADMIN_EMAIL,
    };
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
