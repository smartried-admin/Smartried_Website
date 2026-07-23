const nodemailer = require('nodemailer');

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'info@smartried.com';

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
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP environment variables are not configured.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
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

    await getTransporter().sendMail({
      to: TO_EMAIL,
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      replyTo: email,
      subject: `New website enquiry from ${name}`,
      text,
      html,
    });

    return res.status(200).json({ ok: true, message: 'Enquiry sent successfully.' });
  } catch (error) {
    console.error('Contact form email failed:', error);
    return res.status(500).json({
      ok: false,
      message: 'Unable to send enquiry right now. Please call or email us directly.',
    });
  }
};
