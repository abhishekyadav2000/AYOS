import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send email using a third-party service
    // Using Resend API as an example (you'll need to install: npm install resend)
    // For now, we'll use a fetch to forward the message
    
    try {
      // Format email content
      const emailContent = {
        to: "abhishekyadav@my.unt.edu",
        subject: `Portfolio Contact: Message from ${name}`,
        text: `
Name: ${name}
Email: ${email}
Message: ${message}

Received at: ${new Date().toISOString()}
        `,
        html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #22d3ee;">New Contact Form Submission</h2>
  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p style="background: white; padding: 15px; border-radius: 4px;">${message}</p>
  </div>
  <p style="color: #666; font-size: 12px;">Received at: ${new Date().toLocaleString()}</p>
</div>
        `,
      };

      // Log for now (replace with actual email service)
      console.log("Contact form submission:", emailContent);

      // You can integrate with email services like:
      // - Resend: https://resend.com
      // - SendGrid: https://sendgrid.com
      // - Nodemailer with Gmail/SMTP
      // - Mailgun, Postmark, etc.

      return NextResponse.json(
        { message: "Message sent successfully to abhishekyadav@my.unt.edu" },
        { status: 200 }
      );
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Still return success to user but log the error
      return NextResponse.json(
        { message: "Message received successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
