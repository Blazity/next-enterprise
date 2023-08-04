import { NextResponse } from "next/server"
import { ReactElement } from "react"
import { Resend } from "resend"
import { CreateEmailOptions } from "resend/build/src/emails/interfaces"
import { EmailTemplate, EmailTemplateProps } from "../../../components/Email/EmailTemplate"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const res = await request.json()
  const payload = {
    subject: "Contact Form Submission",
    from: "onboarding@resend.dev",
    react: EmailTemplate(res as Readonly<EmailTemplateProps>) as ReactElement,
    to: "sam.antonis@isacon.be",
  } as CreateEmailOptions
  try {
    const data = await resend.emails.send(payload)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error })
  }
}
