import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="fixed w-full bg-primary-800">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="shrink-0">
              <img className="block h-8 w-auto" src="/Isacon logo RGB_1.png" alt="Isacon" />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className="rounded-md px-3 py-2 text-sm font-medium text-primary-50 hover:bg-primary-700 hover:text-white"
                >
                  Dashboard
                </Link>
                <Link
                  href="/team"
                  className="rounded-md px-3 py-2 text-sm font-medium text-primary-50 hover:bg-primary-700 hover:text-white"
                >
                  Team
                </Link>
                <Link
                  href="/projects"
                  className="rounded-md px-3 py-2 text-sm font-medium text-primary-50 hover:bg-primary-700 hover:text-white"
                >
                  Projects
                </Link>
                <Link
                  href="/calendar"
                  className="rounded-md px-3 py-2 text-sm font-medium text-primary-50 hover:bg-primary-700 hover:text-white"
                >
                  Calendar
                </Link>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex sm:hidden">
            {/* Mobile menu button */}
            <button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-primary-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="sr-only">Open main menu</span>
            </button>
          </div>
        </div>
      </div>

      <div className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          <button className="block rounded-md bg-primary-900 px-3 py-2 text-base font-medium text-white">
            Dashboard
          </button>
          <button className="block rounded-md px-3 py-2 text-base font-medium text-primary-50 hover:bg-primary-700 hover:text-white">
            Team
          </button>
          <button className="block rounded-md px-3 py-2 text-base font-medium text-primary-50 hover:bg-primary-700 hover:text-white">
            Projects
          </button>
          <button className="block rounded-md px-3 py-2 text-base font-medium text-primary-50 hover:bg-primary-700 hover:text-white">
            Calendar
          </button>
        </div>
      </div>
    </nav>
  )
}
