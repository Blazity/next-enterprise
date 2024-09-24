"use client";
import LanguageIcon from '@mui/icons-material/Language';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@package/utils/language/i18n';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
    handleClose();
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        {/* IconButton with globe icon to open language menu */}
        <IconButton
          aria-controls="language-menu"
          aria-haspopup="true"
          onClick={handleClick}
          className="text-white"
        >
          <LanguageIcon />
        </IconButton>
        <Menu
          id="language-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
          <MenuItem onClick={() => changeLanguage('es')}>Español</MenuItem>
        </Menu>
      </Grid>
    </Grid>
  );
};

export default Navbar;
