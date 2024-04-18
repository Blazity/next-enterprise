import { Button } from "components/Button/Button"
import MoveUpWhenVisible from "utils/ScrollAnimations/MoveUpOnScroll"
export default function ContactUs() {
  return (
    <div className="mx-auto max-w-screen-md px-4 py-8 lg:py-16">
      <MoveUpWhenVisible>
        <h2 className="mb-4 text-center text-4xl font-extrabold capitalize leading-none tracking-tight text-white md:text-4xl xl:text-5xl">
          Contact Us
        </h2>
      </MoveUpWhenVisible>
      <MoveUpWhenVisible>
        <p className="mb-8 text-center font-light text-slate-200 dark:text-gray-400 sm:text-xl lg:mb-16">
          Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let
          us know.
        </p>
      </MoveUpWhenVisible>
      <MoveUpWhenVisible>
        <form action="#" className="space-y-8">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-white dark:text-gray-300">
              Your email
            </label>
            <input
              type="email"
              id="email"
              className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300 bg-homeBg2 p-2.5 text-sm text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              placeholder="name@gmail.com"
              required
            />
          </div>
          <div>
            <label htmlFor="subject" className="mb-2 block text-sm font-medium text-white dark:text-gray-300">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              className="dark:shadow-sm-light block w-full rounded-lg border border-gray-300  bg-homeBg2 p-3 text-sm text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              placeholder="Let us know how we can help you"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-white dark:text-gray-400">
              Your message
            </label>
            <textarea
              id="message"
              rows={6}
              className="block w-full rounded-lg border border-gray-300  bg-homeBg2 p-2.5 text-sm text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              placeholder="Leave a comment..."
            ></textarea>
          </div>
          <Button
            type="submit"
            href="#"
            className="rounded-lg bg-gradient-to-r from-vizoleG1 via-vizoleG2 to-vizoleG3 px-5 py-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
          >
            Send message
          </Button>
        </form>
      </MoveUpWhenVisible>
    </div>
  )
}
