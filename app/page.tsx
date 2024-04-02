import { Metadata } from "next"
import { Button } from "components/Button/Button"
import { InfiniteSlider } from "components/Slider/Slider";
import Navbar from "components/Navbar/Navbar"
import { LP_GRID_ITEMS } from "lp-items"
import { FaArrowRight } from "react-icons/fa";

export default function Web() {
  return (
    <section className="bg-[#0f172a] pl-[15%] pr-[15%] h-[100vh] " >
      <div className=" rounded-[3rem] h-[60%] pt-[10%]" style={{
        backgroundImage: `url('/images/glow-bottom.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="mx-auto grid max-w-screen-xl px-4 py-8 text-center lg:py-16">
          <div className="mx-auto place-self-center">
            <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl xl:text-6xl">
              Experience the next dimension
            </h1>
            <p className="mb-6 max-w-2xl font-light text-slate-100 text-gray-200 md:text-lg lg:mb-8 lg:text-xl">
              Let us transform your vision into reality with cutting-edge VR/AR experiences and custom software solutions powered by AI.
            </p>
            <Button href="https://github.com/Blazity/next-enterprise" className="mr-3" intent="hero1" size="hero1">
              Get started
              <div className="ml-2">
              <FaArrowRight />
              </div>
            </Button>
            <Button
              href="https://vercel.com/new/git/external?repository-url=https://github.com/Blazity/next-enterprise"
              intent="secondary" size="hero1"
            >
              Deploy Now

            </Button>
          </div>

        </div>
      </div>
<div className="pt-20">
<InfiniteSlider/>
</div>
    </section>




  )
}
