import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Metadata } from "next"
import Form from "components/Form"

export const metadata: Metadata = {
  title: "Form Components",
}

export default function Web() {
  return (
    <>
      <section className="flex min-h-full grow items-center justify-center bg-slate-200 p-4">
        <div className="max-w-screen-lg grow rounded-3xl bg-white p-8">
          {/* Close button */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-950	text-white">
            <FontAwesomeIcon icon={faXmark} className="h-6 w-6" />
          </div>
          {/* Title */}
          <div className="flex justify-center">
            <h1 className="border-grey-300 w-fit border-b pb-4 text-3xl text-indigo-900">Document Upload</h1>
          </div>
          {/* Form layout */}
          <div className="flex gap-14">
            <Form />
          </div>
        </div>
      </section>
    </>
  )
}
