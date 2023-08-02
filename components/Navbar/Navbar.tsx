"use client"
import {
  Button,
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
    },
    {
      label: "Projects",
      href: "/projects",
      current: currentRoute === "/projects",
    },
  ]

  return (
    <Navbar
      className="bg-primary-800 text-primary-50"
      isMenuOpen={isMenuOpen || false}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarMenuToggle className="flex gap-4 md:hidden" />
      <NavbarMenu>
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.href}>
            <Link
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
      <NavbarBrand>
        <Image src="/Isacon logo RGB_1.png" alt="Isacon" width={40} height={40} />
      </NavbarBrand>
      <NavbarContent className="hidden gap-4 md:flex" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.href} isActive={item.current}>
            <Link href={item.href} aria-current={item.current ? "page" : undefined}>
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
