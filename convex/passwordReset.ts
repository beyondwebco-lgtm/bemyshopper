import { action, mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// Helper: Securely hash a token using Web Crypto SHA-256
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token.trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Helper: Generate a cryptographically secure 32-byte hex token (64 characters)
function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Helper: Build the branded Be My Shopper HTML email template
function buildResetEmailHtml(resetUrl: string, siteUrl: string): string {
  const primaryGreen = "#087D2C";
  const brandOrange = "#FF6500";
  const bgLight = "#F7F9F5";
  const textDark = "#17211B";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Be My Shopper Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${bgLight}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: ${textDark};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${bgLight}; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e7ebe4; overflow: hidden;" cellspacing="0" cellpadding="0">
          
          <!-- Brand Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${primaryGreen} 0%, #065A20 100%); padding: 32px 30px; text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <!-- Logo container -->
                    <div style="background-color: #ffffff; padding: 10px 22px; border-radius: 14px; display: inline-block; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.12);">
                      <img src="${siteUrl}/images/logo.png" alt="Be My Shopper" width="160" style="display: block; max-height: 40px; width: auto; object-fit: contain;" />
                    </div>
                    <div style="color: #E2F5E7; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">
                      Bapatla's Online Marketplace
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <h1 style="margin: 0 0 14px 0; font-size: 24px; font-weight: 900; color: ${textDark}; text-align: center; line-height: 1.25;">
                Reset Your Password
              </h1>
              
              <p style="margin: 0 0 22px 0; font-size: 14px; line-height: 1.6; color: #4A5550; text-align: center;">
                We received a request to reset your Be My Shopper account password. Click the button below to securely create a new password.
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" target="_blank" style="background-color: ${primaryGreen}; color: #ffffff; display: inline-block; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 38px; border-radius: 12px; box-shadow: 0 4px 14px rgba(8, 125, 44, 0.35); text-align: center;">
                      Reset My Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiration Note -->
              <div style="background-color: #F0FDF4; border-left: 4px solid ${primaryGreen}; border-radius: 6px; padding: 12px 16px; margin: 24px 0 20px 0;">
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #166534;">
                  <strong>Note:</strong> This password reset link is valid for <strong>1 hour</strong> and can only be used once.
                </p>
              </div>

              <!-- Backup Text Link -->
              <p style="margin: 20px 0 8px 0; font-size: 11px; line-height: 1.5; color: #7A8580;">
                If the button above doesn't work, copy and paste this URL into your browser:
              </p>
              <p style="margin: 0 0 24px 0; font-size: 11px; line-height: 1.4; color: ${brandOrange}; word-break: break-all;">
                <a href="${resetUrl}" style="color: ${brandOrange}; text-decoration: underline;">${resetUrl}</a>
              </p>

              <!-- Security Warning -->
              <hr style="border: none; border-top: 1px solid #EBEFEA; margin: 24px 0 16px 0;" />
              <p style="margin: 0; font-size: 11px; line-height: 1.5; color: #8A9690; text-align: center;">
                If you did not request this password reset, please ignore this email or contact support. Your account password remains unchanged.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F7F9F5; padding: 20px 30px; text-align: center; border-top: 1px solid #EBEFEA;">
              <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; color: #5A6660;">
                Be My Shopper &bull; 30-Min Express Delivery &bull; Bapatla, AP
              </p>
              <p style="margin: 0; font-size: 10px; color: #9AA6A0;">
                &copy; 2026 BeMyShopper. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Internal query: Check if user exists by email without leaking to client
export const internalGetUserByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Internal mutation: Invalidate previous tokens & store new token hash
export const internalStoreResetToken = internalMutation({
  args: {
    email: v.string(),
    tokenHash: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Invalidate any previously active unused tokens for this email
    const existingTokens = await ctx.db
      .query("passwordResets")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();

    for (const record of existingTokens) {
      if (!record.used) {
        await ctx.db.patch(record._id, { used: true });
      }
    }

    // Insert new hashed token
    await ctx.db.insert("passwordResets", {
      email: args.email,
      tokenHash: args.tokenHash,
      expiresAt: args.expiresAt,
      used: false,
      createdAt: Date.now(),
    });

    return { stored: true };
  },
});

// Mutation to store test reset token for testing verification
export const storeTestResetToken = mutation({
  args: {
    email: v.string(),
    tokenHash: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existingTokens = await ctx.db
      .query("passwordResets")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();

    for (const record of existingTokens) {
      if (!record.used) {
        await ctx.db.patch(record._id, { used: true });
      }
    }

    await ctx.db.insert("passwordResets", {
      email: args.email,
      tokenHash: args.tokenHash,
      expiresAt: args.expiresAt,
      used: false,
      createdAt: Date.now(),
    });

    return { stored: true };
  },
});

// Public Action: Request a password reset email
// Implements account enumeration prevention by always returning a generic success message
export const requestPasswordReset = action({
  args: { email: v.string() },
  handler: async (ctx, args): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = args.email.trim().toLowerCase();

    // Generic confirmation message to prevent account enumeration
    const genericResponse = {
      success: true,
      message:
        "If an account with that email exists, we've sent a link to reset your password. Please check your inbox and spam folder.",
    };

    if (!cleanEmail) {
      return genericResponse;
    }

    // Check if user exists in database
    const user = await ctx.runQuery(internal.passwordReset.internalGetUserByEmail, {
      email: cleanEmail,
    });

    // If user does not exist, do not send email, but return generic success (anti-enumeration)
    if (!user) {
      return genericResponse;
    }

    // Generate cryptographically secure random token (64 hex characters)
    const rawToken = generateSecureToken();
    const tokenHash = await hashToken(rawToken);

    // 1-hour expiration time
    const expiresAt = Date.now() + 60 * 60 * 1000;

    // Store token hash in Convex
    await ctx.runMutation(internal.passwordReset.internalStoreResetToken, {
      email: cleanEmail,
      tokenHash,
      expiresAt,
    });

    // Determine site base URL (prefer SITE_URL or fallback)
    const siteUrl = process.env.SITE_URL || "http://localhost:3000";
    const resetUrl = `${siteUrl}/reset-password?token=${rawToken}`;

    // Dispatch email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const emailHtml = buildResetEmailHtml(resetUrl, siteUrl);
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Be My Shopper <onboarding@resend.dev>",
            to: [cleanEmail],
            subject: "Reset Your Be My Shopper Password",
            html: emailHtml,
          }),
        });

        if (!resendRes.ok) {
          const errText = await resendRes.text();
          console.error("Resend API delivery error for email dispatch:", errText);
        }
      } catch (err: unknown) {
        console.error("Failed to connect to Resend service:", err instanceof Error ? err.message : err);
      }
    } else {
      console.warn("RESEND_API_KEY is not configured in Convex environment variables.");
    }

    return genericResponse;
  },
});

// Public Query: Validate a reset token (used on /reset-password page load)
export const validateResetToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    if (!args.token || args.token.trim().length === 0) {
      return { valid: false, error: "Missing or invalid password reset link." };
    }

    // Compute SHA-256 of candidate token
    // In query context, perform simple digest
    const encoder = new TextEncoder();
    const data = encoder.encode(args.token.trim());
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const tokenHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const record = await ctx.db
      .query("passwordResets")
      .withIndex("by_token_hash", (q) => q.eq("tokenHash", tokenHash))
      .first();

    if (!record) {
      return { valid: false, error: "Invalid or unrecognized password reset link." };
    }

    if (record.used) {
      return {
        valid: false,
        error: "This password reset link has already been used. Please request a new one.",
      };
    }

    if (Date.now() > record.expiresAt) {
      return {
        valid: false,
        error: "This password reset link has expired. Please request a new one.",
      };
    }

    // Obfuscate email for display: e.g. s***@gmail.com
    const [namePart, domainPart] = record.email.split("@");
    const maskedName =
      namePart.length > 2
        ? `${namePart[0]}${"*".repeat(Math.max(1, namePart.length - 2))}${namePart.slice(-1)}`
        : `${namePart[0]}*`;
    const maskedEmail = `${maskedName}@${domainPart}`;

    return { valid: true, email: maskedEmail };
  },
});

// Public Mutation: Securely reset password using valid token
export const resetPasswordWithToken = mutation({
  args: {
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.token || args.token.trim().length === 0) {
      throw new Error("Missing reset token.");
    }

    if (!args.newPassword || args.newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    // Compute SHA-256 hash
    const encoder = new TextEncoder();
    const data = encoder.encode(args.token.trim());
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const tokenHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const record = await ctx.db
      .query("passwordResets")
      .withIndex("by_token_hash", (q) => q.eq("tokenHash", tokenHash))
      .first();

    if (!record) {
      throw new Error("Invalid password reset token.");
    }

    if (record.used) {
      throw new Error("This reset link has already been used. Please request a new one.");
    }

    if (Date.now() > record.expiresAt) {
      throw new Error("This reset link has expired. Please request a new one.");
    }

    // Find the user account
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", record.email))
      .first();

    if (!user) {
      throw new Error("Associated account not found.");
    }

    // Update the password
    await ctx.db.patch(user._id, { password: args.newPassword });

    // Mark reset token as used (single use)
    await ctx.db.patch(record._id, { used: true });

    return { success: true };
  },
});
