import { Metadata } from "next"
import Form from "components/Form"
import Head from "next/head"

export const metadata: Metadata = {
  title: "Form Components",
}

export default function Web() {
  
  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <section className="flex min-h-full grow items-center justify-center bg-slate-200 p-4">
        <div className="max-w-screen-lg grow rounded-3xl bg-white p-8">
            <Form />
        </div>
      </section>
    </>
  )
}
