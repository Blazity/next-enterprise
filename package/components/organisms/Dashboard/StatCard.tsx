"use client"
import React from "react"
import Icon from "@atoms/Icon"
import Title from "@atoms/Title"
import CustomCard from "@molecules/CustomCard"

interface StatCardProps {
  title: string
  value: string
  change: string
  icon: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => {
  return (
    <CustomCard>
      <div className="flex justify-between items-center">
        <div>
          <Title text={title} size="h6" />
          <Title text={value} size="h4" />
          <p className="text-sm text-gray-500">{change}</p>
        </div>
        <Icon name={icon as any} className="text-4xl text-gray-400" />
      </div>
    </CustomCard>
  )
}

export default StatCard