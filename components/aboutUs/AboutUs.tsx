import { Button } from "components/Button/Button"
import { TiTick } from "react-icons/ti"
import { BsPlayCircle } from "react-icons/bs"
import { Modal } from "components/Modal/Modal"
import { useState } from "react"
import { motion } from "framer-motion"
export default function AboutUs() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <div
      className=" h-[60%] rounded-[3rem] max-md:rounded-none"
      style={{
        backgroundImage: `url('/images/glow-top.svg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.div
        animate={{ y: -50 }}
        transition={{ delay: 1 }}
        className="flex w-[100%] justify-around pb-[10vh] pt-[5vh] max-md:flex-wrap"
      >
        <div className="mx-auto max-w-screen-xl px-4 py-8 lg:py-16">
          <div className="mx-auto text-left text-white">
            <h4 className="bg-gradient-to-r from-vizoleG1 via-vizoleG2 to-vizoleG3 bg-clip-text pt-20 font-bold text-transparent ">
              About Vizole Labs
            </h4>
            <div className="mb-4 max-w-2xl text-4xl font-extrabold capitalize leading-none tracking-tight text-white md:text-4xl xl:text-5xl">
              <h2 className="bg-gradient-to-r from-slate-400 via-white to-slate-400 bg-clip-text text-transparent">
                We are a new digital product development agency
              </h2>
            </div>
            <h3 className="mr-90 max-w-2xl text-slate-300">
              we&apos; re dedicated to bringing your ideas to life with innovative solutions tailored to your unique
              needs.
            </h3>
          </div>

          <div className=" mt-3 flex flex-col justify-around text-left text-white">
            <Button
              href="https://vercel.com/new/git/external?repository-url=https://github.com/Blazity/next-enterprise"
              intent="aboutUs"
              size="hero1"
            >
              <TiTick className="mr-2 h-5 w-5" />
              Expertise and Experience
            </Button>
            <Button
              href="https://vercel.com/new/git/external?repository-url=https://github.com/Blazity/next-enterprise"
              intent="aboutUs"
              size="hero1"
            >
              <TiTick className="mr-2 h-5 w-5" />
              Client-Centric Approach
            </Button>
            <Button
              href="https://vercel.com/new/git/external?repository-url=https://github.com/Blazity/next-enterprise"
              intent="aboutUs"
              size="hero1"
            >
              <TiTick className="mr-2 h-5 w-5" />
              Innovation at the Core
            </Button>
          </div>
        </div>
        <div className="flex flex-col justify-around">
          <div className="flex h-[315px] w-[560px] items-center justify-center bg-white max-md:h-[250px] max-md:w-[375px]">
            <div className="flex h-full w-full items-center justify-center">
              <BsPlayCircle
                className="fold:h-[20%] fold:w-[20%] h-[10%] w-[10%] cursor-pointer self-center"
                onClick={() => setIsModalOpen(true)}
              />
              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <iframe
                  className="z_fold:w-[280px] z_fold:h-[170px] h-[315px] w-[560px] max-md:h-[250px] max-md:w-[375px]"
                  src="https://www.youtube.com/embed/SKIXCPn2xB0?si=tQOw37hJEEzbFKFn"
                  title="YouTube video player"
                ></iframe>
              </Modal>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
