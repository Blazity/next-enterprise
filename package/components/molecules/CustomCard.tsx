"use client"
import { CardContent, CardHeader, Card as MUICard } from "@mui/material"
import React from "react"

interface CardProps {
  title?: string
  children: React.ReactNode
  className?: string
}

const CustomCard: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <MUICard className={className}>
      {title && <CardHeader title={title} />}
      <CardContent>{children}</CardContent>
    </MUICard>
  )
}

export default CustomCard