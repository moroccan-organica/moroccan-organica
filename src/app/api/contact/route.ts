
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, company, message, type, liters, destination, product, formType } = body;

    // Basic validation - message is optional for quote forms
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required fields.' },
        { status: 400 }
      );
    }

    // Determine target recipient based on form type or product
    let toEmail = process.env.CONTACT_EMAIL_TO || 'inquiry@moroccanorganica.com';

    if (formType === 'general' || product === 'General Inquiry') {
      toEmail = process.env.CONTACT_EMAIL_GENERAL || 'contact@moroccanorganica.com';
    } else if (formType === 'quote' || (product && product !== 'General Inquiry')) {
      toEmail = process.env.CONTACT_EMAIL_QUOTES || 'inquiry@moroccanorganica.com';
    } else if (formType === 'order') {
      toEmail = process.env.CONTACT_EMAIL_ORDERS || 'orders@moroccanorganica.com';
    }

    console.log(`Email routing: formType=${formType}, product=${product} -> targeting TO=${toEmail}`);

    // Configure the transporter with dynamic authentication if provided
    const authUser = body.formType === 'order' ? (process.env.SMTP_ORDERS_USER || process.env.SMTP_USER) :
      (body.formType === 'general' ? (process.env.SMTP_CONTACT_USER || process.env.SMTP_USER) :
        (process.env.SMTP_INQUIRY_USER || process.env.SMTP_USER));

    const authPass = body.formType === 'order' ? (process.env.SMTP_ORDERS_PASS || process.env.SMTP_PASSWORD) :
      (body.formType === 'general' ? (process.env.SMTP_CONTACT_PASS || process.env.SMTP_PASSWORD) :
        (process.env.SMTP_INQUIRY_PASS || process.env.SMTP_PASSWORD));

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: authUser,
        pass: authPass,
      },
      tls: {
        // Required for self-signed certificates or chain issues
        rejectUnauthorized: false
      },
      connectionTimeout: 10000, // 10s
      greetingTimeout: 10000,
      socketTimeout: 30000
    });

    const subjectPrefix = '[Moroccan Organica]';
    const subject = `${subjectPrefix} ${product || 'Inquiry'} from ${name}`;

    // Email description for the plain text version
    const textContent = `
            ${product ? 'Product: ' + product : 'New Contact Form Submission'}
            Name: ${name}
            Email: ${email}
            Phone: ${phone || 'Not provided'}
            ${type ? 'Type: ' + type : ''}
            ${liters ? 'Quantity: ' + liters + ' Liters' : ''}
            ${destination ? 'Destination: ' + destination : ''}
            ${company && company !== 'Not Provided (Contact Form)' ? 'Company: ' + company : ''}
            
            Message:
            ${message}
        `;

    // Style constants matching the site's theme
    const colors = {
      primary: '#2f3e30',
      bronze: '#b08d55',
      light: '#faf9f6',
      text: '#333333',
      border: '#e0e0e0'
    };

    const mailOptions = {
      from: `"Moroccan Organica" <${process.env.CONTACT_EMAIL_FROM || process.env.SMTP_USER}>`,
      to: toEmail,
      replyTo: email,
      subject: subject,
      text: textContent,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: ${colors.text}; margin: 0; padding: 0; background-color: #f4f4f4; }
  .wrapper { padding: 20px; }
  .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .header { background-color: ${colors.primary}; padding: 30px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-family: 'Times New Roman', serif; letter-spacing: 2px; font-size: 24px; text-transform: uppercase; }
  .banner { background-color: ${colors.bronze}; color: white; padding: 10px; text-align: center; font-size: 14px; font-weight: bold; letter-spacing: 1px; }
  .content { padding: 35px; }
  .section-title { color: ${colors.bronze}; font-size: 13px; text-transform: uppercase; letter-spacing: 1.2px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid ${colors.light}; padding-bottom: 5px; }
  .info-grid { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
  .info-label { font-size: 11px; color: #999; text-transform: uppercase; padding-bottom: 2px; }
  .info-value { font-size: 15px; color: #222; font-weight: 500; padding-bottom: 15px; }
  .message-header { font-size: 14px; font-weight: bold; color: ${colors.primary}; margin-bottom: 10px; }
  .message-body { background-color: ${colors.light}; padding: 20px; border-radius: 4px; border-left: 4px solid ${colors.bronze}; font-style: italic; white-space: pre-wrap; color: #444; }
  .footer { background-color: ${colors.light}; padding: 20px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid ${colors.border}; }
  .action-btn { display: inline-block; padding: 12px 25px; background-color: ${colors.primary}; color: #ffffff !important; text-decoration: none; border-radius: 4px; font-weight: 600; margin-top: 25px; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="email-container">
      <div class="header">
        <h1>Moroccan Organica</h1>
      </div>
      <div class="banner">
        NEW QUOTE REQUEST
      </div>
      <div class="content">
        <div class="section-title">Client Information</div>
        <table class="info-grid">
          <tr>
            <td width="50%">
              <div class="info-label">Full Name</div>
              <div class="info-value">${name}</div>
            </td>
            <td width="50%">
              <div class="info-label">Email Address</div>
              <div class="info-value"><a href="mailto:${email}" style="color: ${colors.primary}; text-decoration: none;">${email}</a></div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="info-label">Phone Number</div>
              <div class="info-value">${phone || 'N/A'}</div>
            </td>
            <td>
              <div class="info-label">Product of Interest</div>
              <div class="info-value">${product || 'General Inquiry'}</div>
            </td>
          </tr>
          ${(type || liters || destination) ? `
          <tr>
            <td>
              <div class="info-label">Specific Type</div>
              <div class="info-value">${type || 'N/A'}</div>
            </td>
            <td>
              <div class="info-label">Quantity Requested</div>
              <div class="info-value">${liters ? liters + ' Liters' : 'N/A'}</div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <div class="info-label">Shipping Destination</div>
              <div class="info-value">${destination || 'N/A'}</div>
            </td>
          </tr>
          ` : ''}
        </table>

        <div class="section-title">Message Details</div>
        <div class="message-body">${message}</div>
        
        <div style="text-align: center;">
          <a href="mailto:${email}" class="action-btn">Reply to Client</a>
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Moroccan Organica Group SARL AU<br>
        Distributed from Agadir, Morocco<br>
        <span style="font-size: 10px; margin-top: 10px; display: block; opacity: 0.7;">This is an automated system notification.</span>
      </div>
    </div>
  </div>
</body>
</html>
            `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
