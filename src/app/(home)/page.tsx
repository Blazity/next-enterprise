"use client"
import { Button, Header } from "../../components"

export default function Web() {
  return (
    <div>
      <Header />
      <Button onClick={() => console.log("Hello World")} variant="primary">
        Hello
      </Button>
      <h1 className="text-lg font-bold">Hello World</h1>
    </div>
  )
}
