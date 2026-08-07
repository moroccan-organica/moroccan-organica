const colors = {
  primary: '#2f3e30',
  bronze: '#b08d55',
  light: '#faf9f6',
  text: '#333333',
  border: '#e0e0e0',
};

const CONTACT = {
  email: 'inquiry@moroccanorganica.com',
  phone: '+212 648-273228',
  website: 'https://www.moroccanorganica.com',
  instagram: 'https://www.instagram.com/moroccanorganic/',
  facebook: 'https://www.facebook.com/moroccanorganica/',
};

export function buildAutoReplyEmail({
  name,
  fromAddress,
}: {
  name: string;
  fromAddress: string;
}) {
  const text = `Dear ${name},

Thank you for your email.

We have received your message and will get back to you as soon as possible. For urgent inquiries regarding our products, samples, or quotations, please contact us directly and we will assist you promptly.

Thank you for your understanding.

Best Regards

Mr. Hassan
Production manager

Mr. Haytam
Sales manager

Organica Group Ltd

Email: ${CONTACT.email}
Tel: ${CONTACT.phone}
Website: www.moroccanorganica.com
Location: Marrakech – Factory in Agadir, Morocco
Exporting Worldwide: EU, USA, ASIA, UK, UAE, KSA.

Follow us on:
Instagram: ${CONTACT.instagram}
Facebook: ${CONTACT.facebook}
`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.7; color: ${colors.text}; margin: 0; padding: 0; background-color: #f4f4f4; }
  .wrapper { padding: 20px; }
  .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .header { background-color: ${colors.primary}; padding: 30px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-family: 'Times New Roman', serif; letter-spacing: 2px; font-size: 24px; text-transform: uppercase; }
  .content { padding: 35px; }
  .greeting { font-size: 16px; margin-bottom: 20px; color: #222; }
  .body-text { font-size: 15px; color: #444; margin-bottom: 16px; }
  .signature { margin-top: 28px; font-size: 14px; color: #333; }
  .signature p { margin: 4px 0; }
  .signature .name { font-weight: 600; color: ${colors.primary}; }
  .signature .role { color: #666; font-size: 13px; }
  .company { margin-top: 20px; font-weight: 700; color: ${colors.bronze}; font-size: 15px; }
  .contact-info { margin-top: 20px; padding: 20px; background-color: ${colors.light}; border-radius: 4px; border-left: 4px solid ${colors.bronze}; font-size: 14px; }
  .contact-info p { margin: 6px 0; }
  .contact-info a { color: ${colors.primary}; text-decoration: none; }
  .social { margin-top: 16px; font-size: 14px; }
  .social a { color: ${colors.bronze}; text-decoration: none; font-weight: 600; }
  .footer { background-color: ${colors.light}; padding: 20px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid ${colors.border}; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="email-container">
      <div class="header">
        <h1>Moroccan Organica</h1>
      </div>
      <div class="content">
        <p class="greeting">Dear ${name},</p>
        <p class="body-text">Thank you for your email.</p>
        <p class="body-text">We have received your message and will get back to you as soon as possible. For urgent inquiries regarding our products, samples, or quotations, please contact us directly and we will assist you promptly.</p>
        <p class="body-text">Thank you for your understanding.</p>
        <div class="signature">
          <p>Best Regards</p>
          <br>
          <p class="name">Mr. Hassan</p>
          <p class="role">Production manager</p>
          <br>
          <p class="name">Mr. Haytam</p>
          <p class="role">Sales manager</p>
          <p class="company">Organica Group Ltd</p>
        </div>
        <div class="contact-info">
          <p>📧 Email: <a href="mailto:${CONTACT.email}">${CONTACT.email}</a></p>
          <p>📞 Tel: <a href="tel:+212648273228">${CONTACT.phone}</a></p>
          <p>🌐 Website: <a href="${CONTACT.website}">www.moroccanorganica.com</a></p>
          <p>📍 Location: Marrakech – Factory in Agadir, Morocco</p>
          <p>✈️ Exporting Worldwide: EU, USA, ASIA, UK, UAE, KSA.</p>
          <p class="social">Follow us on: <a href="${CONTACT.instagram}">Instagram</a> | <a href="${CONTACT.facebook}">Facebook</a></p>
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Organica Group Ltd<br>
        <span style="font-size: 10px; margin-top: 10px; display: block; opacity: 0.7;">This is an automated response. Please do not reply to this email.</span>
      </div>
    </div>
  </div>
</body>
</html>`;

  return {
    from: `"Moroccan Organica" <${fromAddress}>`,
    subject: 'Thank you for contacting Moroccan Organica',
    text,
    html,
  };
}
