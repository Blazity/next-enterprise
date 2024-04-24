import { mailOptions, transporter } from "./mailTransporter"
import { replaceMergeTags, stripHTMLTags } from "app/mail/sliceHtml"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(req: any) {
  const data = await req.json()
  const htmlFilePath = path.join(process.cwd(), "app/mail", "contactForm.html")

  let htmlContent: string
  try {
    htmlContent = fs.readFileSync(htmlFilePath, "utf8")
  } catch (err) {
    console.error("Error reading HTML file: ", err)
    return
  }

  htmlContent = replaceMergeTags(data, htmlContent)
  const plainTextContent = stripHTMLTags(htmlContent)

  try {
    console.log(req.headers)
    // await transporter.sendMail({
    //   ...mailOptions,
    //   subject: `Contact Inquiry - VizoleLabs Web`,
    //   text: plainTextContent,
    //   html: htmlContent,
    // })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: error.status })
  }
}
