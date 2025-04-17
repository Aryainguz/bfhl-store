import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // or your preferred email service
      auth: {
        user: process.env.GMAIL_USER,   // your Gmail username from env
        pass: process.env.GMAIL_PASS,   // your Gmail password (or app password)
      },
    });
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your OTP for Registration',
      text: `Your OTP for registration is: ${otp}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}