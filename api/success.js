export default function handler(req, res) {
  res.status(200).send(`
    <html>
      <head><title>Payment Success</title></head>
      <body style="font-family:sans-serif; text-align:center;">
        <h1>🎉 Payment Successful!</h1>
        <p>Thank you. Your transaction was successful.</p>
        <a href="/">Go back to homepage</a>
      </body>
    </html>
  `);
}

