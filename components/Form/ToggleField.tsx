/**
 * ToggleField Component
 *
 * Renders a toggle switch using Radix UI, integrated with Formik for form state management.
 * Supports custom child content and displays an error message if validation fails.
 */

import * as SwitchPrimitive from "@radix-ui/react-switch"
import { useField } from "formik"
import React, { useState } from "react"
import ErrorMessage from "./ErrorMessage"
import RequiredAsterisk from "./RequiredAsterisk"
import Separator from "./Separator"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock } from "@fortawesome/free-regular-svg-icons"

/**
 * Props for ToggleField.
 *
 * @param children ReactNode - The content to be displayed alongside the toggle switch.
 * @extends React.InputHTMLAttributes<HTMLInputElement> - Inherits standard input attributes.
 */


const ToggleField = ({
  children,
  ...props
}: {
  children: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  const { required, ...restProps } = props

  // Formik hook for managing form state and validation
  const [field, meta] = useField({ ...(restProps as { name: string }), type: "checkbox" })

  // Local state to manage the checked status of the switch
  const [checked, setChecked] = useState(false)

  // Handles checked state change, updates Formik's state accordingly
  const handleCheckedChange = (isChecked: boolean) => {
    setChecked(isChecked);
    field.onChange({ target: { name: field.name, value: isChecked } });
  };


  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <Separator/>
        <label className="flex items-center gap-2 font-bold text-sm leading-tight text-indigo-900">
          {children}
          <RequiredAsterisk required={required} />
        </label>
      </div>
      <div className="flex gap-3 itens-center">
        <SwitchPrimitive.Root
          className="relative h-[25px] w-[42px] cursor-default rounded-full bg-indigo-900 outline-none"
          checked={checked}
          onCheckedChange={(isChecked) => handleCheckedChange(isChecked)}
        >
          <SwitchPrimitive.Thumb className="block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
        </SwitchPrimitive.Root>
        <div className="flex gap-2 md:gap-4 items-center text-xs md:text-sm leading-tight">
          <span>Toggle ON</span>
          <span>|</span>
          <span className="flex gap-2 items-center"><FontAwesomeIcon icon={faClock} />Select Tolerance Level</span>
        </div>
        
      </div>
      
      <ErrorMessage touched={meta.touched} error={meta.error} />
    </div>
  )
}

export default ToggleField
