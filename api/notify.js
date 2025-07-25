export const config = {
  api: {
    bodyParser: false, // Required to read raw POST body
  },
};

import { createHash } from 'crypto';
import getRawBody from 'raw-body';
import https from 'https';
import querystring from 'querystring';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    // 1. Get raw body
    const rawBody = await getRawBody(req);
    const bodyString = rawBody.toString('utf-8');
    const receivedData = querystring.parse(bodyString);

    // 2. Build string for signature check
    const { PAYFAST_PASSPHRASE } = process.env;
    const sortedKeys = Object.keys(receivedData).sort();
    const pfData = sortedKeys
      .map((key) => `${key}=${encodeURIComponent(receivedData[key])}`)
      .join('&');

    const stringToHash = PAYFAST_PASSPHRASE
      ? `${pfData}&passphrase=${encodeURIComponent(PAYFAST_PASSPHRASE)}`
      : pfData;

    const validSignature = createHash('md5').update(stringToHash).digest('hex');

    if (validSignature !== receivedData.signature) {
      console.warn('Invalid signature');
      return res.status(400).send('Invalid signature');
    }

    // 3. Re-post data to PayFast to verify
    const options = {
      hostname: 'sandbox.payfast.co.za',
      path: '/eng/query/validate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(bodyString),
      },
    };

    const verify = await new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => (data += chunk));
        response.on('end', () => resolve(data));
      });

      request.on('error', reject);
      request.write(bodyString);
      request.end();
    });

    if (verify !== 'VALID') {
      console.warn('Validation with PayFast failed');
      return res.status(400).send('Validation failed');
    }

    // 4. ✅ At this point, the payment is confirmed
    console.log("💰 Payment confirmed:", receivedData);

    // TODO: Store payment in your database or file
    // e.g. save `receivedData.payment_status` and `receivedData.amount_gross`

    res.status(200).send('OK');
  } catch (err) {
    console.error('Notify handler error:', err);
    res.status(500).send('Server error');
  }
}

