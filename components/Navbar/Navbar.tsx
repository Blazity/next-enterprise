"use client"
import {
  BriefcaseIcon,
  EnvelopeIcon, 
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline"
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"


export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean | undefined>(false)
  const currentRoute = usePathname()

  const menuItems = [
    {
      label: "Home",
      href: "/",
      current: currentRoute === "/",
      icon: <HomeIcon className="h-6 w-6"/>
    },
    {
      label: "Team",
      href: "/team",
      current: currentRoute === "/team",
      icon: <UsersIcon className="h-6 w-6"/>

    },
    {
      label: "Services",
      href: "/services",
      current: currentRoute === "/services",
      icon: <BriefcaseIcon className="h-6 w-6"/>
    },
    {
      label: "Contact",
      href: "/contact",
      current: currentRoute === "/contact",
      icon: <EnvelopeIcon className="h-6 w-6"/>
    },
  ]

  return (
    <>
      <Navbar
        className={`relative ${
          isMenuOpen ? "" : "rounded-b-full"
        } bg-primary-800 text-primary-50 shadow-sm shadow-primary-600 sm:rounded-b-none`}
        isMenuOpen={isMenuOpen || false}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarMenuToggle className="absolute left-8 flex md:hidden" />
        <NavbarMenu>
          {menuItems.map((item) => (
            <NavbarMenuItem key={item.href} className="text-left">
              <Link
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex-row flex my-6 ml-2 space-x-3">
                {item.icon}
                <span>{item.label}</span>
                </div>
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
        <NavbarBrand className="hidden md:flex">
          <Image src="/Isacon logo RGB_1.png" alt="Isacon" width={50} height={50} />
        </NavbarBrand>
        <NavbarContent className="w-full md:hidden" justify="center">
          <NavbarBrand className="justify-center md:hidden">
            <Image src="/Isacon logo RGB_1.png" alt="Isacon" width={50} height={50} />
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className="hidden gap-16 md:flex" justify="center">
          {menuItems.map((item) => (
            <NavbarItem key={item.href} isActive={item.current}>
              <Link
                className={item.current ? "border-b-2 border-b-primary-50" : ""}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
      </Navbar>
    </>
  )
}
