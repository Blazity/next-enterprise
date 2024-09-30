"use client";
import Grid from "@mui/material/Grid2";
import React from "react";
import { useTranslation } from "react-i18next";
import NumericKey from "@molecules/NumericKey";

interface NumericPadProps {
  onKeyClick: (key: string) => void;
}

const NumericPad: React.FC<NumericPadProps> = ({ onKeyClick }) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={0.4} justifyContent="center" alignItems="center">
      <Grid size={{ xs: 6 }}>
        <NumericKey
          label={t("lbl_cancel")}
          onClick={() => onKeyClick("cancel")}
          className="h-12 w-full bg-danger-light text-white hover:bg-danger-dark"
        />
      </Grid>
      <Grid size={{ xs: 6 }}>
        <NumericKey
          label={t("lbl_clear")}
          onClick={() => onKeyClick("clear")}
          className="h-12 bg-secondary-light text-black"
        />
      </Grid>
      {[...Array(10).keys()].map((i) => (
        <Grid key={i} size={{ xs: 4 }} sx={{ minWidth: "100px" }}>
          <NumericKey
            label={i}
            onClick={() => onKeyClick(i.toString())}
            className="h-16 bg-primary-500 text-white hover:bg-primary-600"
          />
        </Grid>
      ))}
      <Grid size={{ xs: 4 }}>
        <NumericKey
          label="."
          onClick={() => onKeyClick(".")}
          className="h-16 bg-primary-500 text-white hover:bg-primary-600"
        />
      </Grid>
      <Grid size={{ xs: 4 }}>
        <NumericKey
          label={t("lbl_enter")}
          onClick={() => onKeyClick("enter")}
          className="h-12 w-full bg-success-light text-white hover:bg-success-dark"
        />
      </Grid>
    </Grid>
  );
};

export default NumericPad;
