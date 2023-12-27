import React, { useState } from "react"
import { Button, IconButton, MobileSidebar } from "../"
import { Bars3Icon } from "@heroicons/react/24/outline"

export const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <header className="flex w-full items-center justify-between bg-white p-4 md:px-20 md:py-6">
      <div>
        <IconButton onClick={toggleSidebar} variant="primary">
          <Bars3Icon className="h-8 w-8" />
        </IconButton>
      </div>
      <div className="font-['Bienetresocial'] text-base font-normal uppercase leading-5 text-[#000000]">
        SKILLTENSOR
      </div>
      <Button variant="primary">Sign up</Button>
      <MobileSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </header>
  )
}

export default Header
