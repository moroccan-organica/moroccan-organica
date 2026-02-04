
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, company, message } = body;

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required fields.' },
                { status: 400 }
            );
        }

        // Configure the transporter
        // Looking for environment variables, otherwise falling back to a dummy config 
        // that will fail if not set, but prevents crashing immediately on load.
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Email content
        const mailOptions = {
            from: process.env.CONTACT_EMAIL_FROM || process.env.SMTP_USER, // Sender address
            to: process.env.CONTACT_EMAIL_TO || process.env.SMTP_USER, // Receiver address
            replyTo: email,
            subject: `New Contact Form Submission from ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                Phone: ${phone || 'Not provided'}
                Company: ${company || 'Not provided'}
                
                Message:
                ${message}
            `,
            html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f7f7f7; }
  .email-container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e0e0e0; }
  .header { background-color: #2f3e30; padding: 40px 30px; text-align: center; background-image: linear-gradient(135deg, #2f3e30 0%, #1a231b 100%); }
  .header h1 { color: #ffffff; margin: 0; font-family: 'Times New Roman', serif; letter-spacing: 2px; font-size: 26px; font-weight: 500; text-transform: uppercase; }
  .content { padding: 40px; }
  .intro-text { color: #555; margin-bottom: 30px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
  .section-title { color: #b08d55; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin-bottom: 12px; margin-top: 25px; }
  .field-group { margin-bottom: 15px; }
  .field-label { font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; display: block; font-weight: 600; }
  .field-value { font-size: 16px; color: #111; font-weight: 500; }
  .message-box { background-color: #faf9f6; padding: 25px; border-left: 4px solid #b08d55; border-radius: 4px; color: #333; font-style: italic; margin-top: 10px; }
  .footer { background-color: #f0f0f0; padding: 25px; text-align: center; font-size: 13px; color: #888; border-top: 1px solid #e5e5e5; }
  .button { display: inline-block; padding: 12px 24px; background-color: #b08d55; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; font-size: 14px; }
  .highlight { color: #b08d55; font-weight: bold; }
</style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Moroccan Organica</h1>
    </div>
    <div class="content">
      <div class="intro-text">
        <p style="margin-top: 0; font-size: 18px; color: #111;"><strong>New Lead Notification</strong></p>
        <p>You have received a new inquiry from the website contact form.</p>
      </div>
      
      <div class="section-title">Contact Information</div>
      
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 10px;">
        <tr>
          <td width="50%" valign="top" style="padding-bottom: 20px;">
            <span class="field-label">Name</span>
            <div class="field-value">${name}</div>
          </td>
          <td width="50%" valign="top" style="padding-bottom: 20px;">
            <span class="field-label">Email</span>
            <div class="field-value"><a href="mailto:${email}" style="color: #2f3e30; text-decoration: none; border-bottom: 1px dotted #2f3e30;">${email}</a></div>
          </td>
        </tr>
        <tr>
          <td width="50%" valign="top" style="padding-bottom: 20px;">
             <span class="field-label">Phone</span>
             <div class="field-value">${phone || '<span style="color:#aaa;">Not provided</span>'}</div>
          </td>
           <td width="50%" valign="top" style="padding-bottom: 20px;">
             <span class="field-label">Company / Ref</span>
             <div class="field-value">${company || '<span style="color:#aaa;">Not provided</span>'}</div>
          </td>
        </tr>
      </table>

       <div class="section-title">Message Details</div>
       <div class="message-box">
         ${message.replace(/\n/g, '<br>')}
       </div>
       
       <div style="text-align: center; margin-top: 35px;">
         <a href="mailto:${email}" class="button">Reply via Email</a>
       </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Moroccan Organica. All rights reserved.<br>
      <span style="font-size: 11px; margin-top: 5px; display: block;">This email was sent automatically from your website.</span>
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
