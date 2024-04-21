import { mailOptions, transporter } from "./mailTransporter"

import { NextResponse } from "next/server"

export async function post(req: any) {
  const data = await req.json()

  try {
    await transporter.sendMail({
      ...mailOptions,
      subject: data.subject,
      text: `Email: ${data.email}\n\n${data.message}`,
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: error.status })
  }
}
