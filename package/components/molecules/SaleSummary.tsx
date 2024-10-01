"use client";

import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ItemObject } from '@interfaces/ResponseInterfaces/Sale/AddProductsResponseInterface';

interface SaleSummaryProps {
  product: ItemObject;

}

const SaleSummary: React.FC<SaleSummaryProps> = ({ product }) => {
  const { t } = useTranslation()

  return (
    <Box sx={{ 

      color: 'black', 
      borderRadius: '5px',
      boxShadow: '2',
      p: 1,
      mb: 1
    }}>
      <Box sx={{mb: 1, p: 1, boxShadow: '2', }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'primary', borderColor: 'black', fontWeight: 'bold', width: '30%' }}>{t("tle_product")}</TableCell>
              <TableCell sx={{ color: 'primary', borderColor: 'black', fontWeight: 'bold', width: '20%', textAlign: 'right' }}>{t("tle_amount")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ color: 'black', borderColor: 'black' }}>{product.name}</TableCell>
              <TableCell sx={{ color: 'black', borderColor: 'black', textAlign: 'right' }}>1</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Grid container justifyContent='right'>
          <Box sx={{ mt: 5, textAlign: 'right' }}>
            <Grid container>
              <Grid size={{xs:7}} sx={{ pr: 10 }}>
                <Typography variant="body2" align="right">{t("lbl_subtotal")}:</Typography>
              </Grid>
              <Grid size={{xs:5}}>
                <Typography variant="body2" align="left">{product.regularUnitPrice}</Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid size={{xs:7}} sx={{ pr: 5.5 }}>
                <Typography variant="body2" align="right">{t("lbl_tax")}:</Typography>
              </Grid>
              <Grid size={{xs:5}}>
                <Typography variant="body2" align="left">{product.totalTaxes}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Box>
      <Box sx={{ p: 3, boxShadow: '2' }}>
        <Typography variant="h6" sx={{ color: 'primary', display: 'flex', justifyContent: 'space-between' }}>
          <span>{t("tle_total")}:</span>
          <span>{product.extendedPrice}</span>
        </Typography>
      </Box>
    </Box>
  );
};

export default SaleSummary;