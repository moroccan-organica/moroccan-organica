
require('dotenv').config();
const nodemailer = require('nodemailer');

const config = {
    host: process.env.SMTP_HOST || 'mail.moroccanorganica.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    },
    debug: true,
    logger: true,
    connectionTimeout: 20000
};

async function test() {
    console.log('--- Testing SMTP Connection ---');
    console.log('Host:', config.host);
    console.log('User:', config.auth.user);

    const transporter = nodemailer.createTransport(config);

    try {
        console.log('Verifying connection...');
        await transporter.verify();
        console.log('✅ Connection verified successfully!');

        console.log('Sending test email as orders...');
        const info = await transporter.sendMail({
            from: `"Moroccan Organica Bot" <orders@moroccanorganica.com>`,
            to: (process.env.CONTACT_EMAIL_TO || 'inquiry@moroccanorganica.com').replace(/"/g, ''),
            subject: 'Production From-Address Test',
            text: 'Testing if server allows from: orders@ while auth: test@',
            html: '<b>✅ If you see this, we can set the From address to orders!</b>'
        });

        console.log('✅ Message sent: %s', info.messageId);
    } catch (error) {
        console.error('❌ Connection or Send failed:');
        console.error(error);
    }
}

test();
