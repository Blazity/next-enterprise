import { Metadata } from "next"
import { Button } from "components/Button/Button"

import { LP_GRID_ITEMS } from "lp-items"


export default function Web() {
  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto grid max-w-(--breakpoint-xl) px-4 py-8 text-center lg:py-16">
          <div className="mx-auto place-self-center">
            <h1 className="mb-4 max-w-2xl text-4xl leading-none font-extrabold tracking-tight md:text-5xl xl:text-6xl dark:text-white">
              iTunes 
            </h1>
            
          </div>
        </div>
      </section>
     
    </>
  )
}
