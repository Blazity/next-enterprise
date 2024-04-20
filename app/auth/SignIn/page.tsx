"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { loginSchema } from "zodSchema/login"
import Image from "next/image"
import { AiFillApple, AiFillGoogleCircle } from "react-icons/ai"

export default function SignIn() {
  return (
    <section className="relative h-[100vh]">
      <div className=" rigth-[50%] absolute -z-10 align-middle opacity-[0.7] blur-[40px] max-md:right-[10%]">
        <Image
          src="/images/auth-illustration.svg"
          alt="hero"
          width="1440"
          height="450"
          className="block h-auto max-w-none"
        />
      </div>
      <div className="relative ml-auto mr-auto flex max-w-6xl justify-center pl-6 pr-6">
        <div className="pb-20 pt-40 ">
          <div className="flex flex-col items-center justify-center">
            <Image src="/images/logoicon.png" alt="logo" width="100" height="100" />
            <div className="mb-4 max-w-2xl text-4xl font-extrabold capitalize leading-none tracking-tight text-white md:text-4xl xl:text-5xl">
              <h2 className="bg-gradient-to-r from-slate-400 via-white to-slate-400 bg-clip-text p-5 text-center text-transparent">
                Sign In To Your Account
              </h2>
            </div>
            <div className="w-[80%]">
              <form className="w-full max-w-lg">
                <label className="mb-2 block text-sm font-bold text-white" htmlFor="email">
                  Email
                </label>
                <input
                  className=" w-full appearance-none rounded  bg-[#1e293b] px-3 py-2 leading-tight text-white focus:outline-[#F5887A]"
                  id="email"
                  type="text"
                  placeholder="youremail@website.com"
                />
                <label className="mb-2 mt-4 block text-sm font-bold text-white" htmlFor="password">
                  Password
                </label>
                <input
                  className=" w-full appearance-none rounded  bg-[#1e293b] px-3 py-2 leading-tight text-gray-700 shadow focus:outline-[#F5887A]"
                  id="password"
                  type="password"
                  placeholder="Password"
                />
                <button
                  className="focus:shadow-outline focus:shadow-outline hover:shadow-outline mt-4 w-full rounded-full bg-[#F5887A] px-4 py-2 font-bold text-white transition-all hover:bg-[#F0B37D] focus:outline-none"
                  type="button"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-4 flex items-center justify-center text-center">
                <p className="text-slate-500"> Don't have an account?&nbsp; </p>
                <a className="text-[#F5887A]" href="/auth/SignUp">
                  Sign Up
                </a>
              </div>
              <div className="my-[10px] flex items-center justify-between">
                <div className="h-[1px] w-[40%] bg-slate-500"></div>
                <p className="text-slate-500">OR</p>
                <div className="h-[1px] w-[40%] bg-slate-500"></div>
              </div>
            </div>
            <div className="flex w-[80%] items-center justify-around max-md:flex-wrap">
              <button className=" border-conic-gradient relative m-2 inline-flex h-9 w-full items-center justify-around rounded-full border-[1px]   border-transparent bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-1 text-white transition-all">
                <AiFillGoogleCircle className="text-lg" />
                Sign In With Google
              </button>
              <button className=" border-conic-gradient relative m-2 inline-flex h-9 w-full items-center justify-around rounded-full border-[1px]   border-transparent bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-1 text-white transition-all">
                <AiFillApple className="text-lg" />
                Sign In With Icloud
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
