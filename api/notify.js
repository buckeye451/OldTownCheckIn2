// /api/notify.js
// Vercel Serverless Function — sends SMS via Twilio when a visitor checks in
//
// Required Vercel Environment Variables:
//   TWILIO_ACCOUNT_SID    — Your Twilio Account SID
//   TWILIO_AUTH_TOKEN      — Your Twilio Auth Token
//   TWILIO_PHONE_NUMBER    — Your Twilio phone number (e.g., +13175550100)
//   STAFF_KATIE            — Katie's phone number (e.g., +13175551234)
//   STAFF_SAM              — Sam's phone number
//   STAFF_JORDAN           — Jordan's phone number
//   STAFF_ALEX             — Alex's phone number
//
// To add more staff: add a new env var like STAFF_NEWNAME and add them to
// the staff array in CONFIG on the frontend.

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { staffName, visitorName, reason, time } = req.body;

  if (!staffName || !visitorName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Look up phone number from env vars: STAFF_KATIE, STAFF_SAM, etc.
  const envKey = `STAFF_${staffName.toUpperCase().replace(/\s+/g, "_")}`;
  const staffPhone = process.env[envKey];

  if (!staffPhone) {
    console.warn(`No phone number found for staff member: ${staffName} (env: ${envKey})`);
    return res.status(404).json({ error: `No phone number configured for ${staffName}` });
  }

  // Twilio credentials from env
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !twilioPhone) {
    console.error("Missing Twilio environment variables");
    return res.status(500).json({ error: "SMS service not configured" });
  }

  // Compose the message
  const message = [
    `📋 Visitor Check-In — Old Town Design`,
    ``,
    `${visitorName} is at the front desk asking for you.`,
    ``,
    `Reason: ${reason}`,
    `Time: ${time}`,
  ].join("\n");

  // Send via Twilio REST API (no SDK needed)
  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const authHeader = "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64");

  try {
    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: staffPhone,
        From: twilioPhone,
        Body: message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Twilio error:", data);
      return res.status(500).json({ error: "Failed to send SMS", detail: data.message });
    }

    console.log(`✅ SMS sent to ${staffName} (${staffPhone}): SID ${data.sid}`);
    return res.status(200).json({ success: true, sid: data.sid });

  } catch (err) {
    console.error("SMS send error:", err);
    return res.status(500).json({ error: "Failed to send SMS" });
  }
}
