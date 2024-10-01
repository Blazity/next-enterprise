"use client";
import { Box, Button, Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import CheckoutScreen from "@app/selfcheckout/checkout/page";
import Title from "@atoms/Title";

const PreCheckout: React.FC = () => {
  const { t } = useTranslation();
  const [stage, setStage] = useState<"precheckout" | "searching" | "checkout">("precheckout");

  const handleStartCheckout = useCallback(() => {
    setStage("checkout");
  }, []);


  const handleEndTransaction = () => {
    setStage("precheckout");
  };

  if (stage === "checkout") {
    return <CheckoutScreen onEndTransaction={handleEndTransaction} />;
  }

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", marginTop: "20vh" }}>
      <Box sx={{ backgroundColor: "#f1f1f1", padding: "80px", borderRadius: "10px", boxShadow: 6 }}>
        <Grid size={{ xs: 4, md: 6 }}>
          <Title text={t("msj_this_box_is")} size="h3" />
        </Grid>
        <Grid size={{ xs: 4, md: 6 }}>
          <Title text={t("lb_open")} size="h1" />
        </Grid>
        <Grid size={{ xs: 4, md: 6 }}>
          <Title text={t("msj_press_any_key_button_start")} size="h5" />
        </Grid>

        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ marginTop: "40px" }}
          onClick={handleStartCheckout}
        >
          {t("lbl_start")}
        </Button>
      </Box>
    </Container>
  );
};

export default PreCheckout;
