"use client";

import Grid2 from '@mui/material/Grid2';
import React from 'react';
import ActionButtons from '@molecules/ActionButtons';
import ProductSearch from '@molecules/ProductSearch';
import SaleSummary from '@molecules/SaleSummary';

interface ControlPanelProps {
  onVoidOrder: () => void;
  onVoidLast: () => void;
  onResume: () => void;
  onSearchPLU: (plu: string) => void;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onVoidOrder,
  onVoidLast,
  onResume,
  onSearchPLU,
  subtotal,
  discount,
  tax,
  total
}) => {
  return (
    <Grid2 container spacing={4}>
      <Grid2  size={{xs:12}}>
        <ActionButtons onVoidOrder={onVoidOrder} onVoidLast={onVoidLast} onResume={onResume} />
      </Grid2>

      <Grid2  size={{xs:12}}>
        <ProductSearch onSearch={onSearchPLU} />
      </Grid2>

      <Grid2  size={{xs:12}}>
        <SaleSummary subtotal={subtotal} discount={discount} tax={tax} total={total} />
      </Grid2>
    </Grid2>
  );
};

export default ControlPanel;
