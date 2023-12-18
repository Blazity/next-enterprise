import Link from "next/link"


export default async function Web() {
  return (
    <section>
      <div className="mx-auto grid max-w-screen-xl pb-2 text-center">
        <div className="mx-auto place-self-center">
          <div className="relative">
            <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
              <div className="px-6 pb-24 pt-4 sm:pb-24 lg:col-span-7 lg:px-0 lg:pb-48 lg:pt-16 xl:col-span-6">
                <div className="mx-auto max-w-2xl lg:mx-0">
                  <h1 className="mt-4 text-4xl font-bold tracking-tight text-primary-800 sm:mt-10 sm:text-6xl lg:mt-24">
                    Your personal <span className="block xl:inline">web development team</span>
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-primary-800">
                    We are a team of experienced web developers, designers and project managers. We build web
                    applications, websites and mobile apps for startups and established businesses.
                  </p>
                  <div className="mt-10 flex items-center gap-x-6">
                    <Link href="/services" className="text-sm font-semibold leading-6 text-primary-800">
                      Learn more <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="relative lg:col-span-5 mb-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0">
                <img
                  className="aspect-[3/2] w-full object-cover sm:mb-10 lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
                  src="/presentation.svg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
