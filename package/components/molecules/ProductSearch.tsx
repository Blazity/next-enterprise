// components/molecules/ProductSearch.tsx
"use client";

import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@atoms/Button';
import Input from '@atoms/Input';

interface ProductSearchProps {
  onSearch: (plu: string) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onSearch }) => {
  const [plu, setPlu] = useState('');
  const { t } = useTranslation()


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlu(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(plu);
    }
  };

  return (
    <Box sx={{ p:1, mb: 1, boxShadow: '4' }}>
      <Grid container spacing={3} alignItems="center">
        <Grid size={{xs:8}}>
          <Input
            type="text"
            value={plu}
            placeholder={t("msj_enter_plu")}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </Grid>
        <Grid size={{xs:4}}>
          <Button label={t("lbl_search")} variant="primary" onClick={() => onSearch(plu)} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductSearch;
