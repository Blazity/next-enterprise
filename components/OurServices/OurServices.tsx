import { GlowCapture, Glow } from "@codaworks/react-glow"
import { BsAndroid, BsApple, BsGlobe2, BsHeadsetVr } from "react-icons/bs"

export default function OurServices() {
  return (
    <div>
      <GlowCapture>
        <div className="flex flex-col items-center justify-around">
          <div className="mb-4 max-w-3xl text-center text-4xl font-extrabold capitalize leading-none tracking-tight text-white md:text-4xl xl:text-5xl">
            <h2 className="bg-gradient-to-r from-slate-400 via-white to-slate-400 bg-clip-text text-transparent">
              Our Services
            </h2>
          </div>
          <p className="mb-6 max-w-2xl text-center font-light text-[#94a3b8] md:text-lg lg:mb-8 lg:text-xl">
            Let us transform your vision into reality with cutting-edge VR/AR experiences and custom software solutions
            powered by AI.
          </p>
        </div>
        <div className="mt-10 grid max-w-full grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Glow color="#F0B37D">
            <div className=" glowable-text flex max-w-[100%] items-center rounded-[20px] border p-4 glow:border-glow glow:bg-glow/[.50] glow:ring-2 glow:ring-glow">
              <div className=" text-center">
                <div className="mr-3 inline-flex flex-shrink-0 items-center justify-center rounded-full px-5 ">
                  <BsGlobe2 className="h-[50px] w-[50px] text-white" />
                </div>
              </div>
              <div className="flex h-full flex-col rounded-lg ">
                <div className="mb-3 flex items-center ">
                  <h2 className="mb-4 max-w-3xl text-4xl font-extrabold capitalize leading-none tracking-tight text-white md:text-4xl xl:text-3xl">
                    Web Devlopment
                  </h2>
                </div>
                <div className="flex flex-grow flex-col justify-between">
                  <p className="text-base leading-relaxed text-gray-300">
                    We craft engaging and responsive websites that captivate users and drive business growth.
                  </p>
                  <a href="#" className="mt-3 inline-flex items-center text-gray-300 hover:text-white dark:text-white">
                    Learn More
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      strokeWidth="2"
                      className="ml-2 h-4 w-4"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </Glow>
          <Glow color="#F0B37D">
            <div className=" glowable-text flex max-w-[100%] items-center rounded-[20px] border p-4 glow:border-glow glow:bg-glow/[.50] glow:ring-2 glow:ring-glow">
              <div className=" text-center">
                <div className="mr-3 inline-flex flex-shrink-0 items-center justify-center rounded-full px-5 ">
                  <BsApple className="h-[50px] w-[50px] text-white" />
                </div>
              </div>
              <div className="flex h-full flex-col rounded-lg ">
                <div className="mb-3 flex items-center ">
                  <h2 className="mb-4 max-w-3xl text-4xl font-extrabold capitalize leading-none tracking-tight text-white md:text-4xl xl:text-3xl">
                    IOS Application Development
                  </h2>
                </div>
                <div className="flex flex-grow flex-col justify-between">
                  <p className="text-base leading-relaxed text-gray-300">
                    Our skilled team designs and develops intuitive iOS apps that seamlessly integrate with Apple
                    devices.
                  </p>
                  <a href="#" className="mt-3 inline-flex items-center text-gray-300 hover:text-white dark:text-white">
                    Learn More
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      strokeWidth="2"
                      className="ml-2 h-4 w-4"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </Glow>
          <Glow color="#F0B37D">
            <div className=" glowable-text flex max-w-[100%] items-center rounded-[20px] border p-4 glow:border-glow glow:bg-glow/[.50] glow:ring-2 glow:ring-glow">
              <div className=" text-center">
                <div className="mr-3 inline-flex flex-shrink-0 items-center justify-center rounded-full px-5 ">
                  <BsAndroid className="h-[50px] w-[50px] text-white" />
                </div>
              </div>
              <div className="flex h-full flex-col rounded-lg ">
                <div className="mb-3 flex items-center ">
                  <h2 className="mb-4 max-w-3xl text-4xl font-extrabold capitalize leading-none tracking-tight text-white md:text-4xl xl:text-3xl">
                    Android Application Development
                  </h2>
                </div>
                <div className="flex flex-grow flex-col justify-between">
                  <p className="text-base leading-relaxed text-gray-300">
                    From concept to deployment, we create robust Android apps that cater to a diverse user base.
                  </p>
                  <a href="#" className="mt-3 inline-flex items-center text-gray-300 hover:text-white dark:text-white">
                    Learn More
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      strokeWidth="2"
                      className="ml-2 h-4 w-4"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </Glow>
          <Glow color="#F0B37D">
            <div className=" glowable-text flex max-w-[100%] items-center rounded-[20px] border p-4 glow:border-glow glow:bg-glow/[.50] glow:ring-2 glow:ring-glow">
              <div className=" text-center">
                <div className="mr-3 inline-flex flex-shrink-0 items-center justify-center rounded-full px-5 ">
                  <BsHeadsetVr className="h-[50px] w-[50px] text-white" />
                </div>
              </div>
              <div className="flex h-full flex-col rounded-lg ">
                <div className="mb-3 flex items-center ">
                  <h2 className="mb-4 max-w-3xl text-4xl font-extrabold capitalize leading-none tracking-tight text-white md:text-4xl xl:text-3xl">
                    Apps for AR Devices
                  </h2>
                </div>
                <div className="flex flex-grow flex-col justify-between">
                  <p className="text-base leading-relaxed text-gray-300">
                    Immerse users in augmented reality experiences with our cutting-edge applications for MetaQuest and
                    Apple Vision Pro.
                  </p>
                  <a href="#" className="mt-3 inline-flex items-center text-gray-300 hover:text-white dark:text-white">
                    Learn More
                    <svg
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      strokeWidth="2"
                      className="ml-2 h-4 w-4"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </Glow>
        </div>
      </GlowCapture>
    </div>
  )
}
