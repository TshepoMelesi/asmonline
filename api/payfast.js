export default async function handler(req, res) {
  // 1. ONLY allow GET (or POST if you want dynamic amounts)
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  // 2. Load your env vars
  const {
    PAYFAST_MERCHANT_ID,
    PAYFAST_MERCHANT_KEY,
    PAYFAST_RETURN_URL,
    PAYFAST_CANCEL_URL,
    PAYFAST_NOTIFY_URL
    // add on production PAYFAST_PASSPHRASE
  } = process.env;

  // 3. Build the payment data
  const data = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: PAYFAST_RETURN_URL,
    cancel_url: PAYFAST_CANCEL_URL,
    notify_url: PAYFAST_NOTIFY_URL,
    amount: "300.00",  // R100 for example
    item_name: "course",
    item_description: "Full access to the JavaScript Mastery course"
  };

  // 4. Generate signature
  const queryString = Object.entries(data)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  const fullString = PAYFAST_PASSPHRASE
    ? `${queryString}&passphrase=${encodeURIComponent(PAYFAST_PASSPHRASE)}`
    : queryString;

  const crypto = await import('crypto');
  const signature = crypto
    .createHash('md5')
    .update(fullString)
    .digest('hex');

  // 5. Build final redirect URL
  const redirectUrl = `https://sandbox.payfast.co.za/eng/process?${queryString}&signature=${signature}`;

  // 6. Redirect to PayFast
  res.writeHead(302, { Location: redirectUrl });
  res.end();
}

