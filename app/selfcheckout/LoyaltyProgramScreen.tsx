"use client"
import CheckoutScreen from "@app/selfcheckout/CheckoutScreen"
import AskForAffiliation from "@layouts/AskForAffiliation"
import IdentityDocumentNumber from "@layouts/IdentityDocumentNumber"
import TypeIdentityDocument from "@layouts/TypeIdentityDocument"
import { Box, Card, CardContent, Container } from "@mui/material"
import Grid from "@mui/material/Grid2"
import Header from "@organisms/Header"
import { getDocumentsByCountry } from "@package/utils/getDocumentsByCountry"
import { useEffect, useState } from "react"

const LoyaltyProgramScreen: React.FC = () => {
  const [isAffiliated, setIsAffiliated] = useState<boolean | null>(null)
  const [documentType, setDocumentType] = useState<string | null>(null)
  const [documentNumber, setDocumentNumber] = useState<string | null>(null)
  const [goToCheckout, setGoToCheckout] = useState<boolean>(false)
  const [countryDocumentTypes, setCountryDocumentTypes] = useState<string[]>([])

  useEffect(() => {
    const documents = getDocumentsByCountry()
    setCountryDocumentTypes(documents)
  }, [])

  const handleAffiliationSelect = (isAffiliated: boolean) => {
    setIsAffiliated(isAffiliated)
    if (!isAffiliated) {
      setDocumentType("13")
      setDocumentNumber("222222222222")
      setGoToCheckout(true)
    }
  }

  const handleDocumentSelect = (selectedDocumentType: string) => {
    setDocumentType(selectedDocumentType)
  }

  const handleDocumentNumberSubmit = (enteredDocumentNumber: string) => {
    setDocumentNumber(enteredDocumentNumber)
    setGoToCheckout(true)
  }

  if (goToCheckout) {
    return <CheckoutScreen />
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        height: "100hv",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
      }}
    >
      <Card sx={{ width: "100%", p: 2 }}>
        <Header sx={{ minHeight: "32px", marginBottom: 1 }} />

        <CardContent sx={{ padding: "4px", height: "100%" }}>
          <Grid container spacing={2} sx={{ height: "100%" }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
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
                <Box
                  component="img"
                  src="/img/logo.png"
                  alt="Rhiscom Logo"
                  sx={{ width: "600px", height: "auto", mb: 15 }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {isAffiliated === null && <AskForAffiliation onAffiliationSelect={handleAffiliationSelect} />}
              {isAffiliated && !documentType && (
                <TypeIdentityDocument typesDocument={countryDocumentTypes} onDocumentSelect={handleDocumentSelect} />
              )}
              {isAffiliated && documentType && (
                <IdentityDocumentNumber documentType={documentType} onSubmit={handleDocumentNumberSubmit} />
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  )
}

export default LoyaltyProgramScreen
