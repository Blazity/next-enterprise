import { Box, FormControl } from "@mui/material"
import React from "react"
import Input from "@atoms/Input"
import Label from "@atoms/Label"

interface FormFieldProps {
  label: string
  inputType: string
  inputValue: string
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  autocomplete?: string
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  inputType,
  inputValue,
  onInputChange,
  placeholder,
  autocomplete,
}) => {
  return (
    <Box mb={2}>
      <FormControl fullWidth>
        <Label htmlFor={label} text={label} />
        <Input
          type={inputType}
          value={inputValue}
          onChange={onInputChange}
          placeholder={placeholder}
          autocomplete={autocomplete}
        />
      </FormControl>
    </Box>
  )
}

export default FormField
