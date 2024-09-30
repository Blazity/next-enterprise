"use client";

import { TableCell, TableRow } from '@mui/material';
import React from 'react';

interface ProductRowProps {
  amount: number;
  name: string;
  unitValue: number;
  tax: number;
  discount: number;
  total: number;
}

const ProductRow: React.FC<ProductRowProps> = ({ amount, name, unitValue, tax, discount, total }) => {
  return (
    <TableRow>
      <TableCell>{amount}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>${unitValue.toFixed(2)}</TableCell>
      <TableCell>${tax.toFixed(2)}</TableCell>
      <TableCell>${discount.toFixed(2)}</TableCell>
      <TableCell>${total.toFixed(2)}</TableCell>
    </TableRow>
  );
};

export default ProductRow;
