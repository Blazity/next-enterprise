import * as React from "react"

export interface EmailTemplateProps {
  firstName: string
  lastName: string
  email: string
  message: string
  phoneNumber: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  lastName,
  email,
  message,
  phoneNumber,
}) => (
  <div>
    <p>{message}</p>
    <footer>
      {firstName} {lastName} - {email} - {phoneNumber}
    </footer>
  </div>
)
