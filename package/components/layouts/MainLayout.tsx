"use client";

import { Box, Container, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react';
import ControlPanel from '@organisms/Checkout/ControlPanel';
import ProductTable from '@organisms/Checkout/ProductTable';

const products = [
  { id: 1, amount: 2, name: "Product X", unitValue: 2500, tax: 110, discount: 0, total: 5220 },
  { id: 2, amount: 1, name: "Product Y", unitValue: 3500, tax: 230, discount: 0, total: 3730 },
  { id: 3, amount: 3, name: "Product Z", unitValue: 1000, tax: 100, discount: 0, total: 3300 },
];

const MainLayout: React.FC = () => {
  const handleVoidOrder = () => console.log("Void Order");
  const handleVoidLast = () => console.log("Void Last");
  const handleResume = () => console.log("Resume");
  const handleSearchPLU = (plu: string) => console.log("Search PLU:", plu);

  const subtotal = products.reduce((acc, product) => acc + product.unitValue * product.amount, 0);
  const discount = products.reduce((acc, product) => acc + product.discount, 0);
  const tax = products.reduce((acc, product) => acc + product.tax, 0);
  const total = products.reduce((acc, product) => acc + product.total, 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: 'background.default', boxShadow: '4' }}>
      <Container maxWidth={false} sx={{ flexGrow: 1, display: 'flex', py: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{xs:12, md:8}}>
            <Paper elevation={3} sx={{ height: '100%', p: 2}}>
              <ProductTable products={products} />
            </Paper>
          </Grid>
          <Grid size={{xs:12, md:4}}>
            <Paper elevation={3} sx={{ height: '100%', p: 2 }}>
              <ControlPanel
                onVoidOrder={handleVoidOrder}
                onVoidLast={handleVoidLast}
                onResume={handleResume}
                onSearchPLU={handleSearchPLU}
                subtotal={subtotal}
                discount={discount}
                tax={tax}
                total={total}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MainLayout;