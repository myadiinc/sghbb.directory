import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { businessId } = body;

    if (!businessId) {
      return Response.json({ error: "Business ID required" }, { status: 400 });
    }

    // Fetch business
    const business = await base44.asServiceRole.entities.Business.get(businessId);
    
    if (!business) {
      return Response.json({ error: "Business not found" }, { status: 404 });
    }

    if (!business.email) {
      return Response.json({ error: "No email found for business" }, { status: 400 });
    }

    if (business.welcome_email_sent) {
      return Response.json({ message: "Welcome email already sent" }, { status: 200 });
    }

    const listingLink = `https://sghbb.directory/hbb/${business.bsn}`;
    const telegramLink = "https://t.me/+OVeN5KlTks9jODFl";
    const whatsappLink = "https://whatsapp.com/channel/0029Vb7t3D1GZNCiK7vTq42Q";

    const subject = "Welcome to SGHBB.directory";
    const namePart = business.name || "there";
    const message = `Hi ${namePart}!

Firstly, thank you from the bottom of my heart for coming together and building this directory with me. Truly appreciate every one of you 🩷

Your listing will be live here once approved:
${listingLink}

You're strongly encouraged to join at least one of our update channels — Telegram Support Group (TSG) or WhatsApp Channel.

Telegram Support Group isn't just for updates — it's where HBBs gather, ask questions, get help, and build community together:
${telegramLink}

WhatsApp Channel (for announcements only):
${whatsappLink}

Love,
Mie
Director of SGHBB.directory`;

    // Send email
    await base44.integrations.Core.SendEmail({
      to: business.email,
      subject: subject,
      body: message,
    });

    // Update business to mark email as sent
    await base44.asServiceRole.entities.Business.update(businessId, {
      welcome_email_sent: true,
    });

    return Response.json({ success: true, email: business.email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});