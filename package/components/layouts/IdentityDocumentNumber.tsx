"use client"
import { Box, Card, CardContent } from "@mui/material"
import Grid from "@mui/material/Grid2"
import React, { useEffect, useState } from "react"
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

  useEffect(() => {
    const alphaDocuments = ["PASAPORTE", "CURP", "RFC", "NIE", "RUT"] // Documentos que contienen letras
    setIsAlphaEnabled(alphaDocuments.includes(documentType.toUpperCase()))
    setKeyboardMode(isAlphaEnabled ? "alpha" : "numeric")
  }, [documentType, isAlphaEnabled])

  const handleKeyPress = (key: string) => {
    setInputValue((prev) => prev + key)
  }

  const handleDelete = () => {
    setInputValue((prev) => prev.slice(0, -1))
  }

  // Renderiza el teclado basado en el modo seleccionado
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
          <Title text={`Ingrese el número de ${documentType}`} size="h4" />

          {/* Input que muestra el valor actual */}
          <Input
            type="text"
            placeholder="Ingrese el número de documento"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
            <Grid size={{ xs: 4 }}>
              <Button label="Borrar" onClick={handleDelete} variant="danger" className="h-16 w-full" />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Button label="Cancelar" onClick={() => setInputValue("")} variant="danger" className="h-16 w-full" />
            </Grid>
            {renderKeyboard()}
            <Grid size={{ xs: 4 }}>
              <Button label="Ingresar" onClick={() => onSubmit(inputValue)} variant="success" className="h-16 w-full" />
            </Grid>
            {isAlphaEnabled && (
              <Grid size={{ xs: 4 }}>
                <Button
                  label={`Cambiar a ${keyboardMode === "numeric" ? "Alfabético" : "Numérico"}`}
                  onClick={() => setKeyboardMode(keyboardMode === "numeric" ? "alpha" : "numeric")}
                  variant="secondary"
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
