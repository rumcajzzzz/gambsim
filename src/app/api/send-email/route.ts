import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { name, email, subject, message, honeypot, userid } = await request.json();
  const userId = userid;
  
  if (honeypot) {
    console.log('Bot detected, ignoring submission.');
    return NextResponse.json({ success: false, message: 'Spam detected' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: 'gambsimproject@gmail.com', 
      subject: subject,
      text: `
        User ID: ${userId}
        From: ${name} (${email})
        Subject: ${subject}
        Message: ${message}
      `,
      html: `
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>From:</strong> ${name} (e-mail: ${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
