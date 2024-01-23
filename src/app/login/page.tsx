import { Metadata } from "next"
import LoginForm from "./login-form"

export const metadata: Metadata = {
  title: "XAM Login Form",
}

export default function LoginPage() {
  return <LoginForm />
}
