import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { loadConfig } from "../helper/config.hepler";

loadConfig();

export enum Transport {
  SMTP = "SMTP",
}

type Transporter = nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

const transporters: Record<Transport, Transporter | null> = {
  [Transport.SMTP]: null,
};

if (process.env.SMTP_ENABLE && parseInt(process.env.SMTP_ENABLE) == 1) {
  transporters[Transport.SMTP] = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_MAIL_USER,
      pass: process.env.SMTP_MAIL_PASS,
    },
  });
}

export const sendEmail = async (
  mailOptions: Mail.Options,
  transport: Transport = Transport.SMTP
): Promise<any> => {
  try {
    if (transporters[transport]) {
      return await transporters[transport].sendMail(mailOptions);
    } else {
      throw new Error(`${transport} not initialized`);
    }
  } catch (error: any) {
    console.log(error);
    // throw createHttpError(500, { message: error.message });
  }
};

export const resetPasswordEmailTemplate = (token = ""): string => `
<html>
  <body>
    <h3>Welcome to app</h3>
    <p>Click <a href="${process.env.FE_BASE_URL}/reset-password?token=${token}">here</a> to reset your password</p>
  </body>
</html>`;
