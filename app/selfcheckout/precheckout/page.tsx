"use client";
import { Box, Button, Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Title from "@atoms/Title";

const PreCheckout: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleStartCheckout = useCallback(() => {
    router.push("/selfcheckout/verifyAffiliation"); 
  }, [router]);

  useEffect(() => {
    const handleKeyPress = () => {
      handleStartCheckout();
    };

    document.addEventListener("keydown", handleKeyPress);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleStartCheckout]);

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
