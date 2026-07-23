const nodemailer = require('nodemailer');

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'info@smartried.com';
const DEFAULT_TIMEOUT_MS = 12000;

function clean(value) {
  return String(value || '').trim();
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value) {
  return clean(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getTransporter() {
  const host = clean(process.env.SMTP_HOST);
  const port = Number(process.env.SMTP_PORT || 587);
  const user = clean(process.env.SMTP_USER);
  const pass = clean(process.env.SMTP_PASS);
  const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465;

  if (!host || !user || !pass) {
    throw new Error('SMTP environment variables are not configured.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure,
    connectionTimeout: DEFAULT_TIMEOUT_MS,
    greetingTimeout: DEFAULT_TIMEOUT_MS,
    socketTimeout: DEFAULT_TIMEOUT_MS,
    auth: { user, pass },
    tls: {
      servername: process.env.SMTP_TLS_SERVERNAME || host,
      rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED === 'false' ? false : true,
    },
  });
}

function publicErrorMessage(error) {
  const code = error && (error.code || error.command || error.responseCode);

  if (error && error.message === 'SMTP environment variables are not configured.') {
    return 'Email service is not configured. Please check SMTP environment variables in Vercel.';
  }

  if (code === 'EAUTH' || code === 535 || code === 534) {
    return 'Email authentication failed. Please check SMTP_USER and SMTP_PASS.';
  }

  if (code === 'ESOCKET' || code === 'ETIMEDOUT' || code === 'ECONNECTION') {
    return 'Email server connection failed. Please check SMTP_HOST, SMTP_PORT, and SSL/TLS settings.';
  }

  if (code === 'EENVELOPE') {
    return 'Email sender or recipient was rejected. Please check SMTP_FROM and CONTACT_TO_EMAIL.';
  }

  return 'Unable to send enquiry right now. Please check Vercel function logs for SMTP details.';
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, message: 'Contact endpoint is ready.' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const email = clean(body.email);
    const phone = clean(body.phone);
    const interest = clean(body.interest);
    const experience = clean(body.experience);
    const message = clean(body.message);
    const companyWebsite = clean(body.companyWebsite);

    if (companyWebsite) {
      return res.status(200).json({ ok: true });
    }

    if (!firstName || !lastName || !email || !phone || !interest || !isEmail(email)) {
      return res.status(400).json({
        ok: false,
        message: 'Please provide name, valid email, phone number, and interest.',
      });
    }

    const name = `${firstName} ${lastName}`;
    const submittedAt = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const html = `
      <h2>New Smartried Website Enquiry</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;">
        <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(phone)}</td></tr>
        <tr><td><strong>Interested In</strong></td><td>${escapeHtml(interest)}</td></tr>
        <tr><td><strong>Background</strong></td><td>${escapeHtml(experience || 'Not provided')}</td></tr>
        <tr><td><strong>Message</strong></td><td>${escapeHtml(message || 'Not provided')}</td></tr>
        <tr><td><strong>Submitted At</strong></td><td>${escapeHtml(submittedAt)}</td></tr>
      </table>
    `;

    const text = [
      'New Smartried Website Enquiry',
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Interested In: ${interest}`,
      `Background: ${experience || 'Not provided'}`,
      `Message: ${message || 'Not provided'}`,
      `Submitted At: ${submittedAt}`,
    ].join('\n');

    const fromEmail = clean(process.env.SMTP_FROM) || `Smartried Website <${clean(process.env.SMTP_USER)}>`;

    await getTransporter().sendMail({
      to: TO_EMAIL,
      from: fromEmail,
      replyTo: email,
      subject: `New website enquiry from ${name}`,
      text,
      html,
    });

    return res.status(200).json({ ok: true, message: 'Enquiry sent successfully.' });
  } catch (error) {
    console.error('Contact form email failed:', {
      code: error && error.code,
      command: error && error.command,
      responseCode: error && error.responseCode,
      message: error && error.message,
    });
    return res.status(500).json({
      ok: false,
      message: publicErrorMessage(error),
    });
  }
};
