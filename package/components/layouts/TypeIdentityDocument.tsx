"use client"
import { Box, Card, CardContent } from "@mui/material"
import Grid from "@mui/material/Grid2"
import { useTranslation } from "react-i18next"
import Button from "@atoms/Button"
import Label from "@atoms/Label"
import Title from "@atoms/Title"

interface TypesDocumentProps {
  typesDocument: string[]
  onDocumentSelect: (documentType: string) => void
}

const TypeIdentityDocument: React.FC<TypesDocumentProps> = ({ typesDocument, onDocumentSelect }) => {
  const { t } = useTranslation()

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
            p: 1,
          }}
        >
          <Title text= {t("lbl_information_required")} size="h4" />
          <Label htmlFor="loyalty" text={t('msj_select_type_identity_document')} />

          <Grid container spacing={1} justifyContent="center" sx={{ mt: 2 }}>
            {typesDocument.map((documentType, index) => (
              <Grid key={index} size={{ xs: 4, md: 6 }} sx={{ minWidth: "100px" }}>
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
