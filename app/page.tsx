import { Metadata } from "next"
import { Button } from "components/Button/Button"
import { InfiniteSlider } from "components/Slider/Slider";
import Navbar from "components/Navbar/Navbar"
import { LP_GRID_ITEMS } from "lp-items"
import { FaArrowRight, FaFileCsv } from "react-icons/fa";
import '../styles/custom.css'

export default function Web() {
  return (
    <div>
      <section className="bg-[#0f172a] pl-[15%] pr-[15%] h-[60%] " >
        <div className=" rounded-[3rem] h-[80%] pt-[10%]" style={{
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
                <span>Get started</span>
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
        <div className="p-10">
          <InfiniteSlider />
        </div>
      </section>

      <section className="bg-[#0f172a] pl-[15%] pr-[15%] h-[100vh] ">
        <div className=" rounded-[3rem] h-[60%]" style={{
          backgroundImage: `url('/images/glow-top.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <div>

            <div className="mx-auto max-w-screen-xl px-4 py-8 lg:py-16">
              <div className="mx-auto text-white text-left">
                <h4 className="bg-gradient-to-r from-vizoleG1 via-vizoleG2 to-vizoleG3 text-transparent bg-clip-text pt-20 font-bold ">About VizoleLabs</h4>
                <div className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight text-white md:text-4xl xl:text-5xl">
                  <h2 className="bg-gradient-to-r from-slate-400 via-white to-slate-400 text-transparent bg-clip-text" >Our Mission in Motion</h2>
                </div>
                <h3 className="mr-90 text-slate-300">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos, totam culpa officia ad esse</h3>
                <div>
                  <ul className="grid w-1/3 md:grid-cols-1">
                  <div className="pt-2 mt-5">
                    <li>
                      <input type="radio" id="item01" name="items" value="item-01" className="hidden peer" required />
                      <label htmlFor="item01" className="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-transparent border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-homeBg2 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                      <div className="block">
                        <div className="w-full">Section 01</div>
                      </div>
                      </label> 
                    </li>
                    </div>
                    <div className="pt-2">
                    <li>
                      <input type="radio" id="item02" name="items" value="item-02" className="hidden peer" required />
                      <label htmlFor="item02" className="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-transparent border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-homeBg2 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                      <div className="block">
                        <div className="w-full">Section 02</div>
                      </div>
                      </label> 
                    </li>
                    </div>
                    <div className="pt-2">
                    <li>
                      <input type="radio" id="item03" name="items" value="item-03" className="hidden peer" required />
                      <label htmlFor="item03" className="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-transparent border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-homeBg2 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                      <div className="block">
                        <div className="w-full">Section 03</div>
                      </div>
                      </label> 
                    </li>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >
    </div >

  )
}
