"use client"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import React from "react"
import CustomCard from "@molecules/CustomCard"

interface Transaction {
    id: number
    customer: string
    products: number
    total: number
    date: string
  }
  
  interface RecentTransactionsProps {
    transactions: Transaction[]
  }

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
    return (
      <CustomCard title="Transacciones Recientes">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Productos</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.customer}</TableCell>
                <TableCell>{transaction.products}</TableCell>
                <TableCell>${transaction.total.toFixed(2)}</TableCell>
                <TableCell>{transaction.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CustomCard>
    )
  }
  
  export default RecentTransactions