import { betterAuth } from "better-auth";

import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prismablog@ph.com>',
          to: user.email,
          subject: "Please verify your email!",
          html: `
          <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Email Verification</title>
                <style>
                  body {
                    margin: 0;
                    padding: 0;
                    background-color: #f4f6f8;
                    font-family: Arial, Helvetica, sans-serif;
                  }
                  .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                  }
                  .header {
                    background-color: #4f46e5;
                    color: #ffffff;
                    text-align: center;
                    padding: 24px;
                  }
                  .header h1 {
                    margin: 0;
                    font-size: 22px;
                  }
                  .content {
                    padding: 30px;
                    color: #333333;
                    line-height: 1.6;
                  }
                  .content p {
                    margin: 0 0 16px;
                  }
                  .btn-container {
                    text-align: center;
                    margin: 30px 0;
                  }
                  .btn {
                    display: inline-block;
                    padding: 14px 28px;
                    background-color: #4f46e5;
                    color: #ffffff !important;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: bold;
                    font-size: 16px;
                  }
                  .footer {
                    background-color: #f4f6f8;
                    text-align: center;
                    padding: 20px;
                    font-size: 13px;
                    color: #666666;
                  }
                  .link {
                    word-break: break-all;
                    color: #4f46e5;
                  }
                </style>
              </head>

              <body>
                <div class="container">
                  <!-- Header -->
                  <div class="header">
                    <h1>Prisma Blog</h1>
                  </div>

                  <!-- Content -->
                  <div class="content">
                  <h2>Verify your Email Address</h2>
                    <p>Hello ${user.name}👋,</p>

                    <p>
                      Thank you for signing up for <strong>Prisma Blog</strong>.
                      Please verify your email address to activate your account.
                    </p>

                    <div class="btn-container">
                      <a href="${verificationUrl}" class="btn">Verify Email</a>
                    </div>

                    <p>
                      If the button above doesn’t work, copy and paste the following link
                      into your browser:
                    </p>

                    <p class="link">${verificationUrl}</p>

                    <p>
                      This verification link will expire in <strong>24 hours</strong>.
                    </p>

                    <p>
                      If you did not create this account, you can safely ignore this email.
                    </p>

                    <p>Regards,<br /><strong>Prisma Blog Team</strong></p>
                  </div>

                  <!-- Footer -->
                  <div class="footer">
                    © 2026 Prisma Blog. All rights reserved.
                  </div>
                </div>
              </body>
            </html>`,
        });

        console.log("Email sent:", info.messageId);
      } catch (error) {
        console.error("Error sending email:", error);
        throw error;
      }
    },
  },
});
