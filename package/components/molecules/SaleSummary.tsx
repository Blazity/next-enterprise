"use client";

import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface SaleSummaryProps {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

const SaleSummary: React.FC<SaleSummaryProps> = ({ subtotal, discount, tax, total }) => {
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
              <TableCell sx={{ color: 'primary', borderColor: 'black', fontWeight: 'bold', width: '50%' }}>{t("tle_description")}</TableCell>
              <TableCell sx={{ color: 'primary', borderColor: 'black', fontWeight: 'bold', width: '20%', textAlign: 'right' }}>{t("tle_amount")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ color: 'black', borderColor: 'black' }}>Product R</TableCell>
              <TableCell sx={{ color: 'black', borderColor: 'black' }}>Producto para r uso</TableCell>
              <TableCell sx={{ color: 'black', borderColor: 'black', textAlign: 'right' }}>3</TableCell>
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
                <Typography variant="body2" align="left">$ 1.400</Typography>
              </Grid>
            </Grid>
            <Grid container>
            <Grid size={{xs:7}} sx={{ pr: 10 }}>
                <Typography variant="body2" align="right">{t("lbl_discount")}:</Typography>
              </Grid>
              <Grid size={{xs:5}}>
                <Typography variant="body2" align="left">$ 12</Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid size={{xs:7}} sx={{ pr: 5.5 }}>
                <Typography variant="body2" align="right">{t("lbl_tax")}:</Typography>
              </Grid>
              <Grid size={{xs:5}}>
                <Typography variant="body2" align="left">$ 123</Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid size={{xs:7}} sx={{ pr: 5.5 }}>
                <Typography variant="body2" align="right">{t("lbl_total")}:</Typography>
              </Grid>
              <Grid size={{xs:5}}>
                <Typography variant="body2" align="left">$ 1.511</Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Box>
      <Box sx={{ p: 3, boxShadow: '2' }}>
        <Typography variant="h6" sx={{ color: 'primary', display: 'flex', justifyContent: 'space-between' }}>
          <span>{t("tle_total")}:</span>
          <span>$ 12.250</span>
        </Typography>
      </Box>
    </Box>
  );
};

export default SaleSummary;