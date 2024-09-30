"use client"
import { Box, Card, CardContent } from "@mui/material"
import Grid from "@mui/material/Grid2"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Button from "@atoms/Button"
import Input from "@atoms/Input"
import Title from "@atoms/Title"

interface IdentityDocumentNumberProps {
  documentType: string
  onSubmit: (documentNumber: string) => void
}

const IdentityDocumentNumber: React.FC<IdentityDocumentNumberProps> = ({ documentType, onSubmit }) => {
  const [inputValue, setInputValue] = useState<string>("")
  const [keyboardMode, setKeyboardMode] = useState<"numeric" | "alpha">("numeric")
  const [isAlphaEnabled, setIsAlphaEnabled] = useState<boolean>(false)
  const { t } = useTranslation()


  useEffect(() => {
    const alphaDocuments = ["PASAPORTE", "CURP", "RFC", "NIE", "RUT"] 
    setIsAlphaEnabled(alphaDocuments.includes(documentType.toUpperCase()))
    setKeyboardMode(isAlphaEnabled ? "alpha" : "numeric")
  }, [documentType, isAlphaEnabled])

  const handleKeyPress = (key: string) => {
    setInputValue((prev) => prev + key)
  }

  const handleDelete = () => {
    setInputValue((prev) => prev.slice(0, -1))
  }

  const renderKeyboard = () => {
    if (keyboardMode === "numeric") {
      return (
        <>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((num) => (
            <Grid key={num} size={{ xs: 4 }}>
              <Button label={num} onClick={() => handleKeyPress(num)} variant="primary" className="h-16 w-full" />
            </Grid>
          ))}
        </>
      )
    } else {
      return (
        <>
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
            <Grid key={letter} size={{ xs: 2 }}>
              <Button label={letter} onClick={() => handleKeyPress(letter)} variant="primary" className="h-16 w-full" />
            </Grid>
          ))}
        </>
      )
    }
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
          {/* Título */}
          <Title text={`${t('msj_enter_number_of')} ${documentType}`} size="h4" />

          <Input
            type="text"
            placeholder= {t('msj_enter_document_number')}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
            <Grid size={{ xs: 4 }}>
              <Button label= {t('lbl_delete')} onClick={handleDelete} variant="danger" className="h-16 w-full" />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Button label={t('lbl_cancel')} onClick={() => setInputValue("")} variant="danger" className="h-16 w-full" />
            </Grid>
            {renderKeyboard()}
            <Grid size={{ xs: 4 }}>
              <Button label={t('lbl_enter')} onClick={() => onSubmit(inputValue)} variant="success" className="h-16 w-full" />
            </Grid>
            {isAlphaEnabled && (
              <Grid size={{ xs: 4 }}>
                <Button
                  label={`${t('msj_change_to')} ${keyboardMode === "numeric" ? t('lbl_alphabetical') : t('lbl_numeric')}`}
                  onClick={() => setKeyboardMode(keyboardMode === "numeric" ? "alpha" : "numeric")}
                  variant="info"
                  className="h-16 w-full"
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}

export default IdentityDocumentNumber
