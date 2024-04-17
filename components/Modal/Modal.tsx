"use client"

import { useState } from "react"

interface ModalProps {
  // The content of the modal
  children: React.ReactNode

  // The visibility of the modal
  isOpen: boolean

  // Function to close the modal
  onClose: () => void
}

export const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null

  const hadleClose = (e: any) => {
    if (e.target.id === "wrapper") onClose()
  }

  return (
    <div
      id="wrapper"
      onClick={hadleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25 backdrop-blur-sm"
    >
      <div className="flex w-full flex-col lg:w-4/5 xl:w-3/6">
        <h1 className="cursor-pointer place-self-end font-bold text-white" onClick={() => onClose()}>
          X
        </h1>
        <div className="flex h-full w-full flex-col items-center justify-center place-self-center rounded-md bg-black p-5 drop-shadow-md">
          {children}
        </div>
      </div>
    </div>
  )
}
