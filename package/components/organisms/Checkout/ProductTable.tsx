"use client";

import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SaleTransactionObjectInterface } from '@interfaces/ResponseInterfaces/Sale/GetSaleResponseInterface';
import CustomCard from '@molecules/CustomCard';
import UserHeader from '@molecules/UserHeader';

interface ProductTableProps {
  products: SaleTransactionObjectInterface | null;
}

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const { t } = useTranslation();

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
            {products?.list?.length ? (
              products.list.map((product) => (
                <TableRow key={product.idDetail}>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.regularUnitPrice.toFixed(2)}</TableCell>
                  <TableCell>${product.totalTaxes.toFixed(2)}</TableCell>
                  <TableCell>${product.discount.toFixed(2)}</TableCell>
                  <TableCell>${product.extendedPrice.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {t("msj_no_products_added")} {/* Mensaje de no productos */}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
      <Box sx={{ p: 0.2, boxShadow: '2' }}>
        <CustomCard className="bg-gray-700 text-white">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'RGB(255,255,255)', fontWeight: 'bold', width: '20%' }}>
                  {t("tle_total_unit")}
                </TableCell>
                <TableCell sx={{ color: 'RGB(255,255,255)', fontWeight: 'bold', width: '20%' }}>
                  {t("tle_total_taxes")}
                </TableCell>
                <TableCell sx={{ color: 'RGB(255,255,255)', fontWeight: 'bold', width: '20%' }}>
                  {t("tle_total_discount")}
                </TableCell>
                <TableCell sx={{ color: 'RGB(255,255,255)', fontWeight: 'bold', width: '20%' }}>
                  {t("tle_total")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ color: 'RGB(255,255,255)' }}>
                  ${products?.totalSale?.toFixed(2) || '0.00'}
                </TableCell>
                <TableCell sx={{ color: 'RGB(255,255,255)' }}>
                  ${products?.totalTaxes?.toFixed(2) || '0.00'}
                </TableCell>
                <TableCell sx={{ color: 'RGB(255,255,255)' }}>
                  $0.00 {/* Descuento total si aplica */}
                </TableCell>
                <TableCell sx={{ color: 'RGB(255,255,255)' }}>
                  ${((products?.totalWithPromotion ?? 0) + (products?.totalTaxes ?? 0)).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CustomCard>
      </Box>
    </Box>
  );
};

export default ProductTable;
