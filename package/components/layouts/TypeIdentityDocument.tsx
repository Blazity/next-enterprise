"use client"
import { Box, Card, CardContent } from "@mui/material"
import Grid from "@mui/material/Grid2"
import Button from "@atoms/Button"
import Label from "@atoms/Label"
import Title from "@atoms/Title"

interface TypesDocumentProps {
  typesDocument: string[]
  onDocumentSelect: (documentType: string) => void
}

const TypeIdentityDocument: React.FC<TypesDocumentProps> = ({ typesDocument, onDocumentSelect }) => {
  const handleDocumentClick = (documentType: string) => {
    onDocumentSelect(documentType)
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
          <Title text="Se requiere Información" size="h4" />
          <Label htmlFor="loyalty" text="Seleccione el tipo de documento de identidad" />

          <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
            {typesDocument.map((documentType, index) => (
              <Grid key={index} size={{ xs: 6, md: 4 }} sx={{ minWidth: "200px" }}>
                <Button
                  label={documentType}
                  onClick={() => handleDocumentClick(documentType)}
                  variant="primary"
                  className="h-16 w-full"
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}

export default TypeIdentityDocument
