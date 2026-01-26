import { NextRequest, NextResponse } from "next/server";
import { contactRateLimiter, getClientIp } from "@/lib/rateLimit";
import { 
  contactFormSchema, 
  sanitizeForLog, 
  type ContactFormData 
} from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIp = getClientIp(request);
    const rateLimitResult = contactRateLimiter.check(clientIp);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.retryAfter || 60),
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": String(rateLimitResult.remaining),
            "X-RateLimit-Reset": new Date(rateLimitResult.resetTime).toISOString(),
          },
        }
      );
    }

    const body = await request.json();

    // Validate and sanitize input using Zod
    let validatedData: ContactFormData;
    try {
      validatedData = contactFormSchema.parse(body);
    } catch (error) {
      // Zod validation error
      if (error && typeof error === "object" && "issues" in error) {
        const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> };
        return NextResponse.json(
          {
            error: "Validation failed",
            details: zodError.issues.map((e) => ({
              field: e.path.join("."),
              message: e.message,
            })),
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { name, email, message } = validatedData;

    // Send email using a third-party service
    // Using Resend API as an example (you'll need to install: npm install resend)
    // For now, we'll use a fetch to forward the message
    
    try {
      // Sanitize for logging (prevent log injection)
      const safeName = sanitizeForLog(name);
      const safeEmail = sanitizeForLog(email);
      const safeMessage = sanitizeForLog(message);

      // Format email content - Use environment variable for recipient
      const recipientEmail = process.env.CONTACT_EMAIL || "abhishekyadav@my.unt.edu";

      const emailContent = {
        to: recipientEmail,
        subject: `Portfolio Contact: Message from ${safeName}`,
        text: `
Name: ${safeName}
Email: ${safeEmail}
Message: ${safeMessage}

Received at: ${new Date().toISOString()}
IP: ${clientIp}
        `,
        html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #22d3ee;">New Contact Form Submission</h2>
  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Name:</strong> ${safeName}</p>
    <p><strong>Email:</strong> ${safeEmail}</p>
    <p><strong>Message:</strong></p>
    <p style="background: white; padding: 15px; border-radius: 4px;">${safeMessage}</p>
  </div>
  <p style="color: #666; font-size: 12px;">Received at: ${new Date().toLocaleString()}</p>
  <p style="color: #666; font-size: 12px;">IP: ${clientIp}</p>
</div>
        `,
      };

      // Log for now (replace with actual email service)
      console.log(`Contact form submission from ${clientIp}:`, {
        name: safeName,
        email: safeEmail,
        timestamp: new Date().toISOString(),
      });

      // You can integrate with email services like:
      // - Resend: https://resend.com
      // - SendGrid: https://sendgrid.com
      // - Nodemailer with Gmail/SMTP
      // - Mailgun, Postmark, etc.

      return NextResponse.json(
        {
          message: "Message sent successfully",
          success: true,
        },
        {
          status: 200,
          headers: {
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": String(rateLimitResult.remaining - 1),
            "X-RateLimit-Reset": new Date(rateLimitResult.resetTime).toISOString(),
          },
        }
      );
    } catch (emailError) {
      console.error("Error sending email from", clientIp, ":", emailError instanceof Error ? emailError.message : "Unknown error");
      // Still return success to user but log the error
      return NextResponse.json(
        { message: "Message received successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error processing contact form:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
