"use client";

import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomCard from '@molecules/CustomCard';
import UserHeader from '@molecules/UserHeader';

interface Product {
  id: number;
  amount: number;
  name: string;
  unitValue: number;
  tax: number;
  discount: number;
  total: number;
}

interface ProductTableProps {
  products: Product[];
}

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const totalAmount = products.reduce((acc, product) => acc + product.amount, 0);
  const totalUnitValue = products.reduce((acc, product) => acc + product.unitValue * product.amount, 0);
  const totalTax = products.reduce((acc, product) => acc + product.tax, 0);
  const totalDiscount = products.reduce((acc, product) => acc + product.discount, 0);
  const grandTotal = products.reduce((acc, product) => acc + product.total, 0);
  const { t } = useTranslation()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <UserHeader />
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, boxShadow: '2'}}>
        <Table stickyHeader sx={{
          '& .MuiTableCell-root': { 
            padding: '8px 16px',
          }
        }}>
          <TableHead>
            <TableRow>
              <TableCell>{t("tle_amount")}</TableCell>
              <TableCell>{t("tle_product")}</TableCell>
              <TableCell>{t("tle_unit_value")}</TableCell>
              <TableCell>{t("tle_tax")}</TableCell>
              <TableCell>{t("tle_discount")}</TableCell>
              <TableCell>{t("tle_total")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.amount}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.unitValue.toFixed(2)}</TableCell>
                <TableCell>${product.tax.toFixed(2)}</TableCell>
                <TableCell>${product.discount.toFixed(2)}</TableCell>
                <TableCell>${product.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Box sx={{ p:0.2, boxShadow: '2', }}>
        <CustomCard className="bg-gray-700 text-white">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'RGB(255,255,255)', borderColor: 'with', fontWeight: 'bold', width: '20%' }}>{t("tle_item_count")}</TableCell>
                <TableCell sx={{ color: 'RGB(255,255,255)', borderColor: 'with', fontWeight: 'bold', width: '20%' }}>{t("tle_total_unit")}</TableCell>
                <TableCell sx={{ color: 'RGB(255,255,255)', borderColor: 'with', fontWeight: 'bold', width: '20%' }}>{t("tle_total_taxes")}</TableCell>
                <TableCell sx={{ color: 'RGB(255,255,255)', borderColor: 'with', fontWeight: 'bold', width: '20%' }}>{t("tle_total_discount")}</TableCell>
                <TableCell sx={{ color: 'RGB(255,255,255)', borderColor: 'with', fontWeight: 'bold', width: '20%' }}>{t("tle_total")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ color: 'RGB(255,255,255)', borderColor: 'with' }}>{totalAmount}</TableCell>
                <TableCell sx={{ color: 'RGB(255,255,255)', borderColor: 'with' }}>${totalUnitValue.toFixed(2)}</TableCell>
                <TableCell sx={{ color: 'RGB(255,255,255)', borderColor: 'with' }}>${totalTax.toFixed(2)}</TableCell>
                <TableCell sx={{ color: 'RGB(255,255,255)', borderColor: 'with' }}>${totalDiscount.toFixed(2)}</TableCell>
                <TableCell sx={{ color: 'RGB(255,255,255)', borderColor: 'with' }}>${grandTotal.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CustomCard>
      </Box>
    </Box>
  );
};

export default ProductTable;