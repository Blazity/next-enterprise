"use client";
import { Box, Card, CardContent, Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Image from "next/image";
import React from "react";
import CustomLoading from "@atoms/CustomLoading";

const ClientSearch = React.lazy(() => import("@app/selfcheckout/clientSearch/page"));

const VerifyAffiliation: React.FC = () => {
  return (
    <Container
      maxWidth={false}
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
      }}
    >
      <Card sx={{ width: "100%", p: 2 }}>

        <CardContent sx={{ padding: "4px", height: "100%" }}>
          <Grid container spacing={2} sx={{ height: "100%" }} alignItems="center">
          <Grid size = {{xs:12, md:6}}>
          <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  bgcolor: "#f5f5f5",
                  p: 5,
                  borderRadius: 5,
                }}
              >
                <Image
                  src="/img/logo.png"
                  alt="Rhiscom Logo"
                  width={600}
                  height={400}
                  priority={true}
                  style={{ marginBottom: 15 }}
                />
              </Box>
            </Grid>
            <Grid size = {{xs:12, md:6}}>
              <React.Suspense fallback={<CustomLoading />}>
                <ClientSearch />
              </React.Suspense>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default VerifyAffiliation;
