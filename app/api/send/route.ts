import { NextResponse } from "next/server"
import { Resend } from "resend"
import { EmailTemplate } from "../../../components/Email/EmailTemplate"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const res = await request.json()
  try {
    const data = await resend.emails.send({
      subject: res.subject,
      from: "onboarding@resend.dev",
      react: EmailTemplate(res),
      to: "sam.antonis@isacon.be",
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error })
  }
}
