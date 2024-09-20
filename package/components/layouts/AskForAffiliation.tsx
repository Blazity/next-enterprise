"use client"
import { Box, Card, CardContent } from "@mui/material"
import Grid from "@mui/material/Grid2"
import Button from "@atoms/Button"
import Label from "@atoms/Label"
import Title from "@atoms/Title"

interface AskForAffiliationProps {
  onAffiliationSelect: (isAffiliated: boolean) => void
}

const AskForAffiliation: React.FC<AskForAffiliationProps> = ({ onAffiliationSelect }) => {
  const handleYesClick = () => {
    onAffiliationSelect(true)
  }

  const handleNoClick = () => {
    onAffiliationSelect(false)
  }

  return (
    <Card sx={{ width: "100%", maxWidth: "100%" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            p: 2,
          }}
        >
          <Title text="Se requiere Información" size="h3" />
          <Label htmlFor="loyalty" text="¿Está registrado como afiliado?" />
          <Box sx={{ mt: 3, display: "flex", gap: 3 }}>
            <Grid size={{ xs: 6 }} sx={{ minWidth: "200px" }}>
              <Button label="Sí" onClick={handleYesClick} variant="primary" className="h-16 w-full" />
            </Grid>
            <Grid size={{ xs: 6 }} sx={{ minWidth: "200px" }}>
              <Button label="No" onClick={handleNoClick} variant="primary" className="h-16 w-full" />
            </Grid>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default AskForAffiliation
