"use client"; // ใช้ useState และ useEffect ใน Next.js 15

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  // Dropdown State (Desktop)
  const [isSolutionsOpen, setSolutionsOpen] = useState(false);
  const [isIndustriesOpen, setIndustriesOpen] = useState(false);
  const [isAboutOpen, setAboutOpen] = useState(false);

  // Mobile Menu State
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Checkbox Grid State
  const [selected, setSelected] = useState<string[]>([]);
  const options = [
    { id: "customer-experience", label: "Customer Experience", img: "/assets/image2.png" },
    { id: "customer-support", label: "Customer Support", img: "/assets/image2.png" },
    { id: "technical-support", label: "Technical Customer Support", img: "/assets/image2.png" },
    { id: "content-moderation", label: "Content Moderation", img: "/assets/image2.png" },
    { id: "data-processing", label: "Data Processing", img: "/assets/image2.png" },
    { id: "finance-accounting", label: "Finance & Accounting", img: "/assets/image2.png" },
  ];

  // Toggle Checkbox selection
  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <header className="w-full font-['Tenon',sans-serif]">
      {/* Top Announcement Bar */}
      <div className="bg-[#0e3a24] py-3 text-center text-sm text-[#f7e1d2]">
        SupportNinja is hiring! Apply through our Jobs Board.{" "}
        <Link href="#" className="underline text-[#f7e1d2]">
          Find Open Positions Today
        </Link>
      </div>

      {/* Main Navbar (Sticky) */}
      <nav className="sticky top-0 z-50 bg-[#f7e1d2] shadow-md px-4 sm:px-10 py-4 flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center">
          <Image
            src="/assets/image.png"
            alt="SupportNinja Logo"
            width={200}
            height={50}
            priority
          />
        </div>

        {/* Hamburger Button (Mobile Only) */}
        <button
          className="flex items-center justify-center p-2 text-gray-900 rounded-md md:hidden"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {/* Icon Hamburger / Close */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              // X icon
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              // Hamburger icon
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <ul className="hidden space-x-8 text-lg font-medium text-gray-900 md:flex">
          {/* Solutions (Desktop Dropdown) */}
          <li
            className="relative group"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <button className="flex items-center space-x-1">
              <span>Solutions</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18px"
                viewBox="0 -960 960 960"
                width="18px"
                className={`transition-transform duration-300 ${
                  isSolutionsOpen ? "rotate-180" : ""
                }`}
              >
                <path d="M480-333 240-573l51-51 189 189 189-189 51 51-240 240Z" />
              </svg>
            </button>

            {/* Dropdown Solutions */}
            {isSolutionsOpen && (
              <div className="absolute left-0 z-50 p-4 mt-3 bg-white border border-gray-300 rounded-lg shadow-lg w-80">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Customer Experience</h3>
                    <ul className="mt-2 space-y-2 text-sm text-gray-700">
                      <li><Link href="#">Customer Conversion</Link></li>
                      <li><Link href="#">Customer Onboarding</Link></li>
                      <li><Link href="#">Customer Support</Link></li>
                      <li><Link href="#">Technical Support</Link></li>
                      <li><Link href="#">Customer Renewals</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Finance & Accounting</h3>
                    <h3 className="mt-3 font-semibold text-gray-900">Content Moderation</h3>
                    <h3 className="mt-3 font-semibold text-gray-900">Data Processing</h3>
                  </div>
                </div>
              </div>
            )}
          </li>

          {/* Industries (Desktop Dropdown) */}
          <li
            className="relative group"
            onMouseEnter={() => setIndustriesOpen(true)}
            onMouseLeave={() => setIndustriesOpen(false)}
          >
            <button className="flex items-center space-x-1">
              <span>Industries</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18px"
                viewBox="0 -960 960 960"
                width="18px"
                className={`transition-transform duration-300 ${
                  isIndustriesOpen ? "rotate-180" : ""
                }`}
              >
                <path d="M480-333 240-573l51-51 189 189 189-189 51 51-240 240Z" />
              </svg>
            </button>

            {/* Dropdown Industries */}
            {isIndustriesOpen && (
              <div className="absolute left-0 z-50 mt-3 w-[400px] rounded-lg border border-gray-300 bg-white p-4 shadow-lg">
                <div className="grid grid-cols-3 gap-6 font-medium text-gray-900">
                  <span>SaaS</span>
                  <span>AI</span>
                  <span>Ecommerce</span>
                  <span>Healthcare</span>
                  <span>Supply Chain & Logistics</span>
                  <span>Fintech</span>
                </div>
              </div>
            )}
          </li>

          <li><Link href="#">How it Works</Link></li>

          {/* About (Desktop Dropdown) */}
          <li
            className="relative group"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <button className="flex items-center space-x-1">
              <span>About</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18px"
                viewBox="0 -960 960 960"
                width="18px"
                className={`transition-transform duration-300 ${
                  isAboutOpen ? "rotate-180" : ""
                }`}
              >
                <path d="M480-333 240-573l51-51 189 189 189-189 51 51-240 240Z" />
              </svg>
            </button>

            {/* Dropdown About */}
            {isAboutOpen && (
              <div className="absolute left-0 z-50 w-40 p-3 mt-3 bg-white border border-gray-300 rounded-lg shadow-lg">
                <ul className="space-y-2 text-gray-900">
                  <li className="flex justify-between">
                    <Link href="#">About us</Link>
                  </li>
                  <hr />
                  <li className="flex justify-between">
                    <Link href="#">Careers</Link>
                  </li>
                </ul>
              </div>
            )}
          </li>

          <li><Link href="#">Resources</Link></li>
        </ul>

        {/* Desktop - Get Started Button */}
        <Link
          href="#"
          className="hidden md:inline-flex bg-[#0e3a24] text-white px-6 py-2 text-lg rounded-full font-semibold hover:bg-[#0b2d1d] transition"
        >
          Get Started
        </Link>
      </nav>

      {/* Mobile Menu (Slide Down) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#f7e1d2] shadow-md px-4 pb-4">
          <ul className="flex flex-col mt-4 space-y-4 text-lg font-medium text-gray-900">
            <li><Link href="#" className="block">Solutions</Link></li>
            <li><Link href="#" className="block">Industries</Link></li>
            <li><Link href="#" className="block">How it Works</Link></li>
            <li><Link href="#" className="block">About</Link></li>
            <li><Link href="#" className="block">Resources</Link></li>
          </ul>

          {/* Mobile - Get Started Button */}
          <div className="mt-4">
            <Link
              href="#"
              className="inline-flex w-full justify-center bg-[#0e3a24] text-white px-6 py-3 text-lg rounded-full font-semibold hover:bg-[#0b2d1d] transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-[#f7e1d2] py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-700">
            Quickly and seamlessly scale your team with agile, highly customizable outsourcing solutions that power your growth.
          </p>
          <h1 className="mt-6 text-6xl font-bold text-gray-900">
            Outsourcing worth talking about
          </h1>
          <hr className="w-1/2 mx-auto mt-6 border-gray-400" />
        </div>
      </section>

      {/* Outsourcing Options Section */}
      <section className="bg-[#f7e1d2] py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Which outsourcing solutions are you looking for?
        </h2>
        <p className="text-gray-600">Choose as many as you need.</p>

        {/* Options Grid */}
        <div className="grid grid-cols-1 gap-4 px-10 mt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {options.map((option) => (
            <div
              key={option.id}
              className={`relative p-4 rounded-lg shadow-md transition-all duration-300 cursor-pointer flex flex-col items-center justify-center ${
                selected.includes(option.id) ? "bg-white border-2 border-gray-300" : "bg-[#fbeee6]"
              }`}
              onClick={() => toggleSelection(option.id)}
            >
              {/* Checkbox */}
              <div className="absolute top-3 right-3">
                <input
                  type="checkbox"
                  checked={selected.includes(option.id)}
                  onChange={() => toggleSelection(option.id)}
                  className="appearance-none w-5 h-5 border border-gray-500 rounded-md checked:bg-black checked:border-transparent checked:before:content-['✔'] checked:before:text-white checked:before:text-xs flex items-center justify-center transition-all duration-300"
                />
              </div>

              {/* Image & Text */}
              <Image src={option.img} alt={option.label} width={80} height={80} className="mb-3" />
              <h3 className="mt-2 font-semibold text-center">{option.label}</h3>
            </div>
          ))}
        </div>

        {/* Get Started Button */}
        <div className="flex justify-center mt-8">
          <Link
            href="#"
            className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white transition bg-red-600 rounded-full hover:bg-red-700"
          >
            Get Started
            <span className="inline-flex items-center justify-center w-8 h-8 ml-2 bg-white rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#D32F2F">
                <path d="m600-216-51-51 177-177H96v-72h630L549-693l51-51 264 264-264 264Z"/>
              </svg>
            </span>
          </Link>
        </div>
      </section>

      {/* ----------------------------- NEW SECTIONS ----------------------------- */}

      {/* SECTION 1: bg #bfc1b9 + midjourney.png */}
      <section className="bg-[#f7e1d2] py-16 text-center">
        <div className="max-w-6xl mx-auto bg-[#bfc1b9] rounded-lg px-6 py-8 flex flex-col md:flex-row items-center justify-between">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 md:mb-0">
            Driving better business results for 200+ companies.
          </h2>
          <div>
            <Image
              src="/assets/midjourney.png"
              alt="Midjourney Logo"
              width={150}
              height={50}
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: bg-white + image2.png + เนื้อหา 2 คอลัมน์ (ข้อความซ้าย, รูปขวา) */}
      <section className="py-16 bg-white">
        
        <div className="max-w-6xl px-4 mx-auto md:grid md:grid-cols-2 md:gap-8 md:items-center">
        <div className="flex justify-center mt-8 md:mt-0">
            <Image
              src="/assets/image3.png"
              alt="Scale Up"
              width={400}
              height={400}
            />
          </div>
          <div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Free up resources, accelerate growth, and solve for scale.
            </h2>
            <p className="mb-4 text-gray-700">
              At SupportNinja, we combine cutting-edge technology with value-centricity to foster high-performing, reliable teams that turn growing pains into efficient pathways to profitability.
            </p>
            <p className="mb-4 text-gray-700">
              Our customized, agile, AI-enabled solutions don’t just deliver cost savings — they also keep key business outcomes front and center.
            </p>
            <p className="text-gray-700">
              We work closely with you to continually adjust strategies, realize efficiencies, and drive scaling according to your unique needs. Plus, flexibility is baked in so you’re never locked into rigid, long-term contracts.
            </p>
          </div>
         
        </div>
      </section>

      {/* SECTION 3: bg-white + image3.png + เนื้อหา (Don't grow it alone) */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl px-4 mx-auto md:grid md:grid-cols-2 md:gap-8 md:items-center">
          <div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Don’t grow it alone
            </h2>
            <p className="mb-4 text-gray-700">
              Don’t let headcount become a headache. We’ll connect you with talent that meets your needs.
            </p>
            <p className="text-gray-700">
              Your dedicated new team members will become experts in your world — your customers, your tech, your data, your systems — so they can expand on what you’ve built.
            </p>
          </div>
          <div className="flex justify-center mt-8 md:mt-0">
            <Image
              src="/assets/image4.png"
              alt="Grow Together"
              width={200}
              height={200}
            />
          </div>
        </div>
      </section>
{/* SECTION 4 */}
<section className="py-16 bg-white">
  <div className="max-w-6xl px-4 mx-auto">
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {/* Customer Support */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-3">
          {/* Icon (No Background, Enlarged, #2b2c30) */}
          <span className="inline-flex items-center justify-center w-10 h-10 mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              width="24px"
              fill="#2b2c30"
              viewBox="0 -960 960 960"
            >
              <path d="M432-144v-72h312v-267q0-110-76.78-187.5t-187-77.5Q370-748 293-670.5T216-483v227h-48q-29.7 0-50.85-21.74Q96-299.48 96-330v-74q0-23 13-41t35-23l3-51q9-63 38-117.5t73.5-94.5q44.5-40 101.49-62.5 56.99-22.5 120-22.5t119.81 22.56q56.81 22.55 101.5 62.5Q746-691 775-637t38 117l3 52q21 5 34.5 21.5T864-408v84q0 22-13.5 38.5T816-264v48q0 29.7-21.15 50.85Q773.7-144 744-144H432Zm-59.79-264q-15.21 0-25.71-10.29t-10.5-25.5q0-15.21 10.29-25.71t25.5-10.5q15.21 0 25.71 10.29t10.5 25.5q0 15.21-10.29 25.71t-25.5 10.5Zm216 0q-15.21 0-25.71-10.29t-10.5-25.5q0-15.21 10.29-25.71t25.5-10.5q15.21 0 25.71 10.29t10.5 25.5q0 15.21-10.29 25.71t-25.5 10.5ZM265-458q-9-97 55.7-167.5T482-696q82 0 142.5 55T694-504q-85 0-154.5-46.5T432-672q-14 71-57.5 127.5T265-458Z"/>
            </svg>
          </span>
          <h3 className="text-xl font-semibold text-[#2b2c30]">Customer Support</h3>
        </div>
        <p className="text-[#2b2c30] mb-4">
          Transform every interaction into a positive experience with customer-centric support that scales as you grow.
        </p>
        <Link href="#" className="font-semibold text-[#2b2c30] hover:underline">
          Explore Customer Support &rarr;
        </Link>
      </div>

      {/* Customer Experience */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-3">
          <span className="inline-flex items-center justify-center w-10 h-10 mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              width="24px"
              fill="#2b2c30"
              viewBox="0 -960 960 960"
            >
              <path d="m347-72-75-124-141-32 13-144-96-108 96-108-13-144 141-32 75-124 133 57 133-57 75 124 141 32-13 144 96 108-96 108 13 144-141 32-75 124-133-57-133 57Zm29-91 104-44 104 44 58-97 110-25-10-111 74-84-74-84 10-111-110-25-58-97-104 44-104-44-58 97-110 24 10 112-74 84 75 84-11 112 110 25 58 96Zm104-317Zm-51 144 238-237-51-51-187 186-85-84-51 51 136 135Z"/>
            </svg>
          </span>
          <h3 className="text-xl font-semibold text-[#2b2c30]">Customer Experience</h3>
        </div>
        <p className="text-[#2b2c30] mb-4">
          Enhance every stage of your customer journey and scale confidently — from a simple touchpoint to the entire lifecycle.
        </p>
        <Link href="#" className="font-semibold text-[#2b2c30] hover:underline">
          Explore Customer Experience &rarr;
        </Link>
      </div>

      {/* Technical Customer Support */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-3">
          <span className="inline-flex items-center justify-center w-10 h-10 mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              width="24px"
              fill="#2b2c30"
              viewBox="0 -960 960 960"
            >
              <path d="M48-144v-72h864v72H48Zm120-120q-29.7 0-50.85-21.15Q96-306.3 96-336v-408q0-29.7 21.15-50.85Q138.3-816 168-816h624q29.7 0 50.85 21.15Q864-773.7 864-744v408q0 29.7-21.15 50.85Q821.7-264 792-264H168Zm0-72h624v-408H168v408Zm0 0v-408 408Z"/>
            </svg>
          </span>
          <h3 className="text-xl font-semibold text-[#2b2c30]">Technical Customer Support</h3>
        </div>
        <p className="text-[#2b2c30] mb-4">
          Outsourced dedicated experts on your business to answer customer questions in detail.
        </p>
        <Link href="#" className="font-semibold text-[#2b2c30] hover:underline">
          Explore Technical Customer Support &rarr;
        </Link>
      </div>

      {/* Content Moderation */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-3">
          <span className="inline-flex items-center justify-center w-10 h-10 mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              width="24px"
              fill="#2b2c30"
              viewBox="0 -960 960 960"
            >
              <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z"/>
            </svg>
          </span>
          <h3 className="text-xl font-semibold text-[#2b2c30]">Content Moderation</h3>
        </div>
        <p className="text-[#2b2c30] mb-4">
          Build a thriving online presence with a team specially trained to uphold your community standards.
        </p>
        <Link href="#" className="font-semibold text-[#2b2c30] hover:underline">
          Explore Content Moderation &rarr;
        </Link>
      </div>

      {/* Data Processing */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-3">
          <span className="inline-flex items-center justify-center w-10 h-10 mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              width="24px"
              fill="#2b2c30"
              viewBox="0 -960 960 960"
            >
              <path d="m403-96-22-114q-23-9-44.5-21T296-259l-110 37-77-133 87-76q-2-12-3-24t-1-25q0-13 1-25t3-24l-87-76 77-133 110 37q19-16 40.5-28t44.5-21l22-114h154l22 114q23 9 44.5 21t40.5 28l110-37 77 133-87 76q2 12 3 24t1 25q0 13-1 25t-3 24l87 76-77 133-110-37q-19 16-40.5 28T579-210L557-96H403Zm59-72h36l19-99q38-7 71-26t57-48l96 32 18-30-76-67q6-17 9.5-35.5T696-480q0-20-3.5-38.5T683-554l76-67-18-30-96 32q-24-29-57-48t-71-26l-19-99h-36l-19 99q-38 7-71 26t-57 48l-96-32-18 30 76 67q-6 17-9.5 35.5T264-480q0 20 3.5 38.5T277-406l-76 67 18 30 96-32q24 29 57 48t71 26l19 99Zm18-168q60 0 102-42t42-102q0-60-42-102t-102-42q-60 0-102 42t-42 102q0 60 42 102t102 42Zm0-144Z"/>
            </svg>
          </span>
          <h3 className="text-xl font-semibold text-[#2b2c30]">Data Processing</h3>
        </div>
        <p className="text-[#2b2c30] mb-4">
          Receive analyzed data, specific to how you need it interpreted and presented.
        </p>
        <Link href="#" className="font-semibold text-[#2b2c30] hover:underline">
          Explore Data Processing &rarr;
        </Link>
      </div>

      {/* Finance & Accounting */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-3">
          <span className="inline-flex items-center justify-center w-10 h-10 mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              width="24px"
              fill="#2b2c30"
              viewBox="0 -960 960 960"
            >
              <path d="M446-216h67v-47q49-8 81-42t32-79q0-45-27.5-77T514-514q-61-22-80.5-37.5T414-592q0-20 17.5-33t45.5-13q28 0 49 13.5t28 36.5l59-25q-12-33-38.5-55.5T513-697v-47h-66v48q-45 10-72 38.5T348-591q0 45 30.5 76.5T475-460q45 16 65.5 34t20.5 42q0 26-21 43.5T488-323q-33 0-58.5-22T395-402l-62 26q12 42 42 71.5t71 40.5v48Zm34 120q-79 0-149-30t-122.5-82.5Q156-261 126-331T96-480q0-80 30-149.5t82.5-122Q261-804 331-834t149-30q80 0 149.5 30t122 82.5Q804-699 834-629.5T864-480q0 79-30 149t-82.5 122.5Q699-156 629.5-126T480-96Zm0-72q130 0 221-91t91-221q0-130-91-221t-221-91q-130 0-221 91t-91 221q0 130 91 221t221 91Zm0-312Z"/>
            </svg>
          </span>
          <h3 className="text-xl font-semibold text-[#2b2c30]">Finance & Accounting</h3>
        </div>
        <p className="text-[#2b2c30] mb-4">
          Streamline your financial operations with expert accounting and bookkeeping services.
        </p>
        <Link href="#" className="font-semibold text-[#2b2c30] hover:underline">
          Explore Finance & Accounting &rarr;
        </Link>
      </div>
    </div>
  </div>
</section>


{/* SECTION 5 */}
<section className="py-16 bg-white">
  <div className="max-w-6xl px-4 mx-auto">
    {/* Row 1: Images Left, Text Right */}
    <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center">
      {/* Images (Left) */}
      <div className="flex justify-center mb-8 md:mb-0">
        {/* คุณอาจจัดวาง image5, image6 ซ้อนกัน หรือวางเคียงกันได้ตามต้องการ */}
       
      {/* Text (Right) */}
      <div>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          We’re passionate about our people.
        </h2>
        <p className="mb-4 text-gray-700">
          Our people-first culture attracts and retains top talent...
        </p>
        <p className="mb-6 text-gray-700">
          For nearly a decade, we’ve fostered the growth, wellbeing, and career development
          of our team members — and that’s earned us industry-high talent retention rates.
        </p>
        <Link
          href="#"
          className="inline-block px-6 py-3 rounded-full bg-[#0e3a24] text-white font-semibold hover:bg-[#0b2d1d] transition"
        >
          Read our story
        </Link>
      </div>
      </div>

      <div className="relative w-fit">
          <Image
            src="/assets/image5.png"
            alt="Image 5"
            width={500}
            height={500}
    
          />
        </div>
    </div>
  </div>
</section>

<section className="py-16 bg-white">
  <div className="max-w-6xl px-4 mx-auto">
    {/* Row 2: Text Left, Image Right */}
    <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center">
      {/* Text (Left) */}

      {/* Image (Right) */}
      <div className="flex justify-center mt-8 md:mt-0">
        <Image
          src="/assets/image7.png"
          alt="Image 7"
          width={700}
          height={700}
          className="rounded-lg shadow-md"
        />
      </div>
      <div>
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Grow your career and unleash your potential.
        </h2>
        <p className="mb-4 text-gray-700">
          Ready to expand your horizons at a truly global company? 
        </p>
        <p className="mb-6 text-gray-700">
          At SupportNinja, we prioritize your progress, celebrate your wins, and provide 
          a supportive environment where you can thrive. Check out our openings today.
        </p>
        <Link
          href="#"
          className="inline-block px-6 py-3 rounded-full bg-[#0e3a24] text-white font-semibold hover:bg-[#0b2d1d] transition"
        >
          View open roles
        </Link>
      </div>

    </div>
  </div>
</section>
{/* SECTION 6 */}
<section className="bg-[#f7e1d2] py-16">
  <div className="max-w-6xl px-4 mx-auto md:grid md:grid-cols-2 md:gap-8 md:items-center">
    {/* Left Side: Text */}
    <div className="mb-8 md:mb-0">
      <h2 className="mb-4 text-4xl font-bold text-gray-900">
        We’re better together. Start building your dream team.
      </h2>
      <p className="mb-6 text-gray-700">
        Design a custom outsourcing solution that drives results.
      </p>

      {/* ปุ่ม Get Started สีแดง */}
      <Link
        href="#"
        className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white transition bg-red-600 rounded-full hover:bg-red-700"
      >
        Get Started
        <span className="inline-flex items-center justify-center w-8 h-8 ml-2 bg-white rounded-full">
          {/* ไอคอนลูกศร → */}
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#D32F2F">
            <path d="m600-216-51-51 177-177H96v-72h630L549-693l51-51 264 264-264 264Z"/>
          </svg>
        </span>
      </Link>
    </div>

    {/* Right Side: Image */}
    <div className="flex justify-center">
      <Image
        src="/assets/image8.png"
        alt="Building Dream Team"
        width={400}
        height={300}
        className="rounded-lg shadow-md"
      />
    </div>
  </div>
</section>
<footer className="bg-[#bfc1b9] py-8">
  <div className="max-w-6xl px-4 mx-auto">
    {/* Top Row: Logo + Middle Columns + Get Started Button */}
    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
      {/* Logo (Left) */}
      <div className="mb-6 md:mb-0">
        <Image
          src="/assets/image.png"
          alt="SupportNinja Logo"
          width={150}
          height={40}
          className="mb-2"
        />
      </div>

      {/* Middle Columns (Solutions, Industries, Resources, Follow, Company) */}
      <div className="flex flex-wrap gap-8">
        {/* Column: Solutions */}
        <div>
          <h4 className="mb-2 font-bold text-gray-900">Solutions</h4>
          <ul className="space-y-1 text-sm text-gray-900">
            <li><Link href="#">Customer Experience</Link></li>
            <li><Link href="#">Customer Conversion</Link></li>
            <li><Link href="#">Customer Onboarding</Link></li>
            <li><Link href="#">Customer Support</Link></li>
            <li><Link href="#">Technical Customer Support</Link></li>
            <li><Link href="#">Customer Renewals</Link></li>
            <li><Link href="#">Content Moderation</Link></li>
            <li><Link href="#">Data Processing</Link></li>
            <li><Link href="#">Finance & Accounting</Link></li>
          </ul>
        </div>

        {/* Column: Industries */}
        <div>
          <h4 className="mb-2 font-bold text-gray-900">Industries</h4>
          <ul className="space-y-1 text-sm text-gray-900">
            <li><Link href="#">SaaS</Link></li>
            <li><Link href="#">AI</Link></li>
            <li><Link href="#">Ecommerce</Link></li>
            <li><Link href="#">Healthcare</Link></li>
            <li><Link href="#">Supply Chain & Logistics</Link></li>
            <li><Link href="#">Fintech</Link></li>
          </ul>
        </div>

        {/* Column: Resources */}
        <div>
          <h4 className="mb-2 font-bold text-gray-900">Resources</h4>
          <ul className="space-y-1 text-sm text-gray-900">
            <li><Link href="#">Resources</Link></li>
            <li><Link href="#">FAQs</Link></li>
            <li><Link href="#">Glossary</Link></li>
          </ul>
        </div>

        {/* Column: Follow */}
        <div>
          <h4 className="mb-2 font-bold text-gray-900">Follow</h4>
          <ul className="space-y-1 text-sm text-gray-900">
            <li><Link href="#">LinkedIn</Link></li>
            <li><Link href="#">YouTube</Link></li>
            <li><Link href="#">Twitter</Link></li>
            <li><Link href="#">Facebook</Link></li>
          </ul>
        </div>

        {/* Column: Company */}
        <div>
          <h4 className="mb-2 font-bold text-gray-900">Company</h4>
          <ul className="space-y-1 text-sm text-gray-900">
            <li><Link href="#">How it Works</Link></li>
            <li><Link href="#">About</Link></li>
            <li><Link href="#">Careers</Link></li>
            <li><Link href="#">Contact</Link></li>
          </ul>
        </div>
      </div>

      {/* Get Started Button (Right) */}
      <div className="mt-6 md:mt-0">
        <Link
          href="#"
          className="inline-block px-6 py-3 text-lg font-semibold text-white transition bg-red-600 rounded-full hover:bg-red-700"
        >
          Get started
        </Link>
      </div>
    </div>

    {/* Bottom Row: Copyright & Policy */}
    <div className="flex flex-col pt-4 mt-6 text-sm text-gray-700 border-t border-gray-400 md:flex-row md:items-center md:justify-between">
      <p>© 2025 SupportNinja, a registered trademark of Ninja Partners, LLC</p>
      <div className="flex mt-2 space-x-4 md:mt-0">
        <Link href="#" className="hover:underline">
          Privacy Policy
        </Link>
        <Link href="#" className="hover:underline">
          Security Policy
        </Link>
        <Link href="#" className="hover:underline">
          Terms of Use
        </Link>
      </div>
    </div>
  </div>
</footer>

      {/* ----------------------------------------------------------------------- */}
    </header>
  );
}
