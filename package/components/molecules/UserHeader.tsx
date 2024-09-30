"use client";

import { Box } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useAtom } from 'jotai';
import React from 'react';
import { useTranslation } from 'react-i18next';
import UserAtom from '@atoms/states/UserAtom';

const UserHeader: React.FC = () => {
  const [user] = useAtom(UserAtom);
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
            {user ? `${t("lbl_name_customer")}: ${user.name} ${user.lastName}` : `${t("lbl_name_customer")}: Anónimo`}
          </Typography>
        </Grid2>

        <Grid2>
          <Typography variant="body2" color="textSecondary" className="text-white">
            {user ? `${t("lbl_dni_customer")}: ${user.idTypeUser}` : `${t("lbl_dni_customer")}: 222222222222`}
          </Typography>
        </Grid2>

        <Grid2>
          <Typography variant="body2" className="text-white">
            {user ? `${t("lbl_email_customer")}: ${user.email}` : `${t("lbl_email_customer")}: generic@example.com`}
          </Typography>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default UserHeader;
