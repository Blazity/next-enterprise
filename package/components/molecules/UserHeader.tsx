"use client";

import { Box } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useAtom } from 'jotai';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomerAtom from '@atoms/states/CustomerAtom';

const CustomerHeader: React.FC = () => {
  const [customer] = useAtom(CustomerAtom);
  const { t } = useTranslation()


  return (
    <Box sx={{mb: 1, boxShadow: '4', }}>
      <Grid2
        container
        justifyContent="space-between"
        alignItems="center"
        className="bg-blue-600 text-white p-4"
      >
        <Grid2>
          <Typography variant="h6" className="font-bold">
            {customer ? `${t("lbl_name_customer")}: ${customer.name} ${customer.firstSurname}` : `${t("lbl_name_customer")}: Anónimo`}
          </Typography>
        </Grid2>

        <Grid2>
          <Typography variant="body2" color="textSecondary" className="text-white">
            {customer ? `${t("lbl_dni_customer")}: ${customer.dni}` : `${t("lbl_dni_customer")}: 222222222222`}
          </Typography>
        </Grid2>

        <Grid2>
          <Typography variant="body2" className="text-white">
            {customer ? `${t("lbl_email_customer")}: ${customer.mail}` : `${t("lbl_email_customer")}: generic@example.com`}
          </Typography>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default CustomerHeader;
