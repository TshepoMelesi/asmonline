export default async function handler(req, res) {
  const pfHost = "https://sandbox.payfast.co.za"; // Use live link for production
  const merchant_id = process.env.PAYFAST_MERCHANT_ID;
  const merchant_key = process.env.PAYFAST_MERCHANT_KEY;
  const passphrase = process.env.PAYFAST_PASSPHRASE;

  const data = {
    merchant_id,
    merchant_key,
    return_url: "https://afolics.online/success",
    cancel_url: "https://afolics.online/cancel",
    notify_url: "https://afolics.online/api/notify",

    amount: "100.00", // R100.00
    item_name: "1-on-1 Tutoring Session",
    email_address: "customer@example.com",
  };

  // Build the query string
  // test
  const query = Object.entries(data)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join("&");

  // Generate signature
  const crypto = await import("crypto");
  const signature = crypto
    .createHash("md5")
    .update(query + `&passphrase=${passphrase}`)
    .digest("hex");

  // Redirect to PayFast
  const payfastUrl = `${pfHost}/eng/process?${query}&signature=${signature}`;
  res.redirect(302, payfastUrl);
}

