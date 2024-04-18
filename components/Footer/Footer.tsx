import React from "react"
import { FaInstagram } from "react-icons/fa"
import { FaTwitter } from "react-icons/fa"
import { FaLinkedin } from "react-icons/fa"

function Footer() {
  return (
    <div className="bg-[#0f172a]">
      <div className="flex h-1/2 w-full flex-col items-start justify-around bg-[#0f172a] p-20 md:flex-row">
        <div className="p-5 ">
          <ul>
            <p className="bg-gradient-to-r from-vizoleG1 via-vizoleG2 to-vizoleG3 bg-clip-text pb-6 text-3xl font-bold text-transparent">
              VizoleLabs
            </p>
            <div className="flex gap-6 pb-5 text-white">
              <FaInstagram className="cursor-pointer text-2xl hover:text-yellow-600" />
              <FaTwitter className="cursor-pointer text-2xl hover:text-vizoleG2" />
              <FaLinkedin className="cursor-pointer text-2xl hover:text-vizoleG2" />
            </div>
          </ul>
        </div>
        <div className="p-5">
          <ul>
            <p className="pb-4 text-2xl font-bold text-white">Services</p>
            <li className="text-md cursor-pointer pb-2 font-semibold text-gray-500 hover:text-vizoleG2">
              Web Development
            </li>
            <li className="text-md cursor-pointer pb-2 font-semibold text-gray-500 hover:text-vizoleG2">
              IOS App Development
            </li>
            <li className="text-md cursor-pointer pb-2 font-semibold text-gray-500 hover:text-vizoleG2">
              Android App Development
            </li>
          </ul>
        </div>
        <div className="p-5">
          <ul>
            <p className="pb-4 text-2xl font-bold text-white">Company</p>
            <li className="text-md cursor-pointer pb-2 font-semibold text-gray-500 hover:text-vizoleG2">About</li>
            <li className="text-md cursor-pointer pb-2 font-semibold text-gray-500 hover:text-vizoleG2">Products</li>
            <li className="text-md cursor-pointer pb-2 font-semibold text-gray-500 hover:text-vizoleG2">Pricing</li>
          </ul>
        </div>
        <div className="p-5">
          <ul>
            <p className="pb-4 text-2xl font-bold text-white">Support</p>
            <li className="text-md cursor-pointer pb-2 font-semibold text-gray-500 hover:text-vizoleG2">Contact</li>
            <li className="text-md cursor-pointer pb-2 font-semibold text-gray-500 hover:text-vizoleG2">
              Support Portals
            </li>
            <li className="text-md cursor-pointer pb-2 font-semibold text-gray-500 hover:text-vizoleG2">
              Privacy Policy
            </li>
            <li className="text-md cursor-pointer pb-2 font-semibold text-gray-500 hover:text-vizoleG2">
              Terms & Conditions
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-[#0f172a] p-5 text-center">
        <h1 className=" font-semibold text-white">© 2024 All rights reserved | VizoleLabs PVT LTD</h1>
      </div>
    </div>
  )
}

export default Footer
