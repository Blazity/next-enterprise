"use client"
import React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import CustomCard from "@molecules/CustomCard"

interface ChartProps {
  data: Array<{ name: string; total: number }>
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  return (
    <CustomCard title="Resumen de Ventas">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey="name" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value = 0) => `$${value}`}  // Establecer valor por defecto aquí
          />
          <Bar dataKey="total" fill="#1976d2" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CustomCard>
  )
}

export default Chart