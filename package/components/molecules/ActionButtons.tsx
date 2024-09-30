"use client";
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@atoms/Button';

interface ActionButtonsProps {
  onVoidOrder: () => void;
  onVoidLast: () => void;
  onResume: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onVoidOrder, onVoidLast, onResume }) => {
  const { t } = useTranslation()

  return (
    <Box 
      sx={{ 
        mb: 1, 
        p: 1, 
        boxShadow: 4, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center'
      }}
    >
      <Grid 
        container 
        spacing={2}
        justifyContent="center" 
        alignItems="center" 
      >
        <Grid size={{xs:4}}>
        <Button 
            label={t("lbl_void_order")}
            variant="danger" 
            onClick={onVoidOrder} 
            className="full-width-button"
          />
        </Grid>
        <Grid size={{xs:4}}>
          <Button 
            label={t("lbl_void_last")}
            variant="danger" 
            onClick={onVoidLast} 
            className="full-width-button" 
          />
        </Grid>
        <Grid size={{xs:4}}>
          <Button 
            label={t("lbl_resume")}
            variant="primary" 
            onClick={onResume} 
            className="full-width-button" 
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ActionButtons;
