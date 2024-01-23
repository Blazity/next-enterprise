import { Metadata } from "next"
import Dashboard from "./dashboard"

export const metadata: Metadata = {
  title: "XAM Dashboard",
}

export default function Web() {
  return <Dashboard />
}
