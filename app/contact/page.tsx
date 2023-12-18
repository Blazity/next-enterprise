"use client"
import { BuildingOffice2Icon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import { FormEvent, useEffect, useState } from "react"

export default function Contact() {
  const [isSent, setIsSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.target as HTMLFormElement
    const isValid = form.checkValidity()

    if (!isValid) {
      return
    }

    setIsLoading(true)
    fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value,
        message: form.message.value,
        phoneNumber: form.phoneNumber.value,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send message")
        }
        form.reset()
        setIsSent(true)
      })
      .catch((error) => {
        setError(error.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  useEffect(() => {
    if(isSent) {
      const timeout = setTimeout(() => {
        setIsSent(false)
      }, 3000)
      return () => clearTimeout(timeout)
    }
  })
  return (
    <div className="relative isolate bg-primary-50">
        {isSent && (
        <div 
        onClick={() => setIsSent(false)} 
        className="cursor-pointer fixed inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out"
        >
          <div className="bg-primary-50/90 border rounded-lg h-auto w-auto p-4" role="alert">
            <span className="font-semibold">Thank you! Your message was sent successfully</span>
          </div>
        </div>
      )}
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="relative px-5 pb-1 pt-12 sm:pt-32 lg:static lg:px-8">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-primary-800">Get in touch</h2>
            <p className="mt-6 text-lg leading-8 text-primary-800">
              Feel free to contact us for any questions or inquiries. we will get back to you as soon as possible.
            </p>
            <dl className="mt-10 space-y-4 text-base leading-7 text-primary-800">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Address</span>
                  <BuildingOffice2Icon className="h-7 w-6 text-primary-800" aria-hidden="true" />
                </dt>
                <dd>
                  Kammenstraat 57
                  <br />
                  2000, Antwerpen
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Telephone</span>
                  <PhoneIcon className="h-7 w-6 text-primary-800" aria-hidden="true" />
                </dt>
                <dd>
                  <a className="hover:text-white" href="tel:+32496799751">
                    +32496799751
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Email</span>
                  <EnvelopeIcon className="h-7 w-6 text-primary-800" aria-hidden="true" />
                </dt>
                <dd>
                  <a className="hover:text-white" href="mailto:sam.antonis@isacon.be">
                    sam.antonis@isacon.be
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="px-6 pb-10 pt-20 sm:pb-24 lg:p-10">
          <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold leading-6 text-primary-800">
                  First name
                </label>
                <div className="mt-2.5">
                  <input
                    required
                    type="text"
                    name="firstName"
                    id="firstName"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-primary-800 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold leading-6 text-primary-800">
                  Last name
                </label>
                <div className="mt-2.5">
                  <input
                    required
                    type="text"
                    name="lastName"
                    id="lastName"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-primary-800 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-semibold leading-6 text-primary-800">
                  Email
                </label>
                <div className="mt-2.5">
                  <input
                    required
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-primary-800 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="phoneNumber" className="block text-sm font-semibold leading-6 text-primary-800">
                  Phone number
                </label>
                <div className="mt-2.5">
                  <input
                    required
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    autoComplete="tel"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-primary-800 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-semibold leading-6 text-primary-800">
                  Message
                </label>
                <div className="mt-2.5">
                  <textarea
                    required
                    name="message"
                    id="message"
                    rows={4}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-primary-800 shadow-md ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6"
                    defaultValue={""}
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                disabled={isLoading}
                type="submit"
                className="rounded-md bg-primary-800 px-3.5 py-2.5 text-center text-sm font-semibold text-primary-50 shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              >
                {isLoading ? (
                  <Image
                  src="/loading.png"
                  alt="loading"
                  width={18}
                  height={18}
                  className="animate-spin grayscale"
                  />
                ) : (
                  "Send message"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
