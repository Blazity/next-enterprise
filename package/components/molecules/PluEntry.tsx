"use client"
import { Box } from "@mui/material"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import Input from "@atoms/Input"

const PluEntry: React.FC = () => {
  const [plu, setPlu] = useState("")
  const { t } = useTranslation()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlu(e.target.value)
  }

  return (
    <Box sx={{ p: 1, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
      <Input
        type="text"
        value={plu}
        onChange={handleInputChange}
        placeholder={t("lbl_enter_PLU")}
        autocomplete="off"
      />
    </Box>
  )
}

export default PluEntry
