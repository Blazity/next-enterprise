"use client";
import Grid from '@mui/material/Grid2';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@package/utils/language/i18n';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en');

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  useEffect(() => {
    setLanguage(i18n.language);
  }, []);

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      className="bg-blue-600 text-white p-4"
    >
      <Grid>
        <h1 className="text-white font-bold">{t('lbl_wellcome')}</h1>
      </Grid>
      <Grid>
        <Select
          value={language}
          onChange={(e) => changeLanguage(e.target.value as string)}
          variant="outlined"
          className="bg-white text-black"
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Español</MenuItem>
        </Select>
      </Grid>
    </Grid>
  );
};

export default Navbar;
