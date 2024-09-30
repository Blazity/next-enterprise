"use client"
import * as MUIIcons from "@mui/icons-material"
import React from "react"

interface IconProps {
  name: keyof typeof MUIIcons
  className?: string
}

const Icon: React.FC<IconProps> = ({ name, className }) => {
  const IconComponent = MUIIcons[name]
  return <IconComponent className={className} />
}

export default Icon