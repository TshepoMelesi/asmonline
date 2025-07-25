export default function handler(req, res) {
  res.status(200).send(`
    <html>
      <head><title>Payment Cancelled</title></head>
      <body style="font-family:sans-serif; text-align:center;">
        <h1>❌ Payment Cancelled</h1>
        <p>Your payment was cancelled. You can try again.</p>
        <a href="/">Return to Homepage</a>
      </body>
    </html>
  `);
}

