const nodemailer = require("nodemailer")

export interface MailOptions {
  from: string
  to: string
}

export const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: "keshawa@vizolelabs.com",
    pass: process.env.NEXT_PUBLIC_ZOHO_PASS,
  },
})

export const mailOptions: MailOptions = {
  from: "Keshawa Anuhas <keshawa@vizolelabs.com>",
  to: "Keshawa Anuhas <keshawa@vizolelabs.com>",
}
