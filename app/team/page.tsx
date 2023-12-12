const people = [
  {
    name: "Sam Antonis",
    role: "Lead Developer",
    imageUrl: "/Sam.jpg",
    linkedinUrl: "https://www.linkedin.com/in/sam-antonis-296144186/",
  },
  {
    name: "Nick Eliaerts",
    role: "Junior Developer",
    imageUrl:"/Nick.jpg",
    linkedinUrl: "https://www.linkedin.com/in/nick-eliaerts-76b8574a/",
  },
  {
    name: "Britt Van Damme",
    role: "Ecommerce Specialist",
    imageUrl: "/Britt.jpg",
    linkedinUrl: "https://www.linkedin.com/in/britt-van-damme/",
  },
  {
    name: "Silke Joosens",
    role: "Designer",
    imageUrl: "/Silke.jpg",
    linkedinUrl: "https://www.linkedin.com/in/silkejoosens/",
  },
]

export default async function About() {
  return (
    <section>
      <div className="p-2 mx-auto grid max-w-screen-xl text-center">
        <div className="mx-auto place-self-center">
          <div className="pb-4 pt-8">
            <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
              <div className="mx-auto max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-primary-800 sm:text-4xl">Meet our team</h2>
                
                <p className="mt-4 text-lg leading-8 text-primary-800">
                  We are a dynamic group of individuals , passionate about our respective fields of expertise.
                  {/*We’re a dynamic group of individuals who are passionate about what we do.*/}
                </p>
              </div>
              <ul
                role="list"
                className="l mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none  lg:grid-cols-4 lg:gap-8"
              >
                {people.map(({ name, imageUrl, role, linkedinUrl }) => (
                  <li key={name} className="rounded-2xl bg-primary-800 px-8 py-10">
                    <img className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56" src={imageUrl} alt={name} />
                    <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-primary-50">{name}</h3>
                    <p className="text-sm leading-6 text-primary-50">{role}</p>
                    <ul role="list" className="mt-6 flex justify-center gap-x-6">
                      <li>
                        <a href={linkedinUrl} className="text-primary-50 hover:text-primary-50">
                          <span className="sr-only">LinkedIn</span>
                          <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </a>
                      </li>
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
