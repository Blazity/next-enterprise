"use client";
import LanguageIcon from '@mui/icons-material/Language';
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Botón de 3 puntos verticales
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserAtom from '@atoms/states/UserAtom';
import i18n from '@package/utils/language/i18n';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user] = useAtom(UserAtom);
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);

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
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    setCurrentDateTime(new Date());

    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentDateTime
    ? currentDateTime.toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : '';
  const formattedTime = currentDateTime
    ? currentDateTime.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : '';

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      className="bg-blue-600 text-white p-4"
    >
      <Grid>
        <h1 className="text-white font-bold">
          {user ? `${t('lbl_wellcome')} ${user.name} ${user.lastName}` : t('lbl_wellcome')}
        </h1>
      </Grid>

      <Grid>
        <Typography variant="body2" color="text.secondary" className="text-white">
          {formattedDate} - {formattedTime}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="text-white">
          {t("lbl_Store")}: <strong>8004</strong> | {t("lbl_register")}: <strong>317</strong>
        </Typography>
      </Grid>

      <Grid container alignItems="center">
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

        {/* Botón de 3 puntos verticales */}
        <IconButton
          size="small"
          className="text-white ml-4"
          onClick={() => {
            console.log('Menú de opciones abierto');
          }}
        >
          <MoreVertIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default Navbar;
