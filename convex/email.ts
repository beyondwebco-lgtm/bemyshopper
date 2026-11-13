import { action } from "./_generated/server";
import { v } from "convex/values";

// Convex Action to send password reset emails via Resend or custom email API
export const sendResetEmail = action({
  args: {
    email: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.warn(
        "RESEND_API_KEY is not set in Convex environment variables. Verification code for",
        args.email,
        "is:",
        args.code
      );
      return {
        sent: false,
        reason: "NO_API_KEY",
        message: "Email provider not configured in Convex environment variables yet.",
      };
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "BeMyShopper <onboarding@resend.dev>",
          to: [args.email],
          subject: "Your BeMyShopper Password Reset Code",
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px;">
              <h2 style="color: #137A2C; margin: 0 0 8px 0; font-size: 22px;">BeMyShopper</h2>
              <p style="font-size: 14px; color: #374151;">Hello,</p>
              <p style="font-size: 14px; color: #4b5563;">We received a request to reset your password for your BeMyShopper account in Bapatla.</p>
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 18px; border-radius: 12px; text-align: center; margin: 20px 0;">
                <p style="font-size: 11px; color: #166534; margin: 0 0 6px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Your 6-Digit Verification Code</p>
                <div style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #137A2C;">${args.code}</div>
              </div>
              <p style="font-size: 12px; color: #6b7280; line-height: 1.5;">This code will expire in <strong>15 minutes</strong>. If you did not make this request, you can safely ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="font-size: 11px; color: #9ca3af; text-align: center;">BeMyShopper &bull; 30-Min Fast Delivery &bull; Bapatla, Andhra Pradesh</p>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Resend API error:", errText);
        return { sent: false, reason: "API_ERROR", error: errText };
      }

      const data = await response.json();
      return { sent: true, data };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Failed to send reset email:", errorMsg);
      return { sent: false, reason: "FETCH_FAILED", error: errorMsg };
    }
  },
});

