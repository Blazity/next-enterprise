import * as SwitchPrimitive from "@radix-ui/react-switch"
import { useField } from "formik"
import React, { useState } from "react"
import ErrorMessage from "./ErrorMessage"
import RequiredAsterisk from "./RequiredAsterisk"
import Separator from "./Separator"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock } from "@fortawesome/free-regular-svg-icons"

const ToggleField = ({
  children,
  ...props
}: {
  children: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  const { required, ...restProps } = props
  const [field, meta] = useField({ ...(restProps as { name: string }), type: "checkbox" })
  const [checked, setChecked] = useState(false)

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
          onCheckedChange={(isChecked) => {
            setChecked(isChecked)
            field.onChange({ target: { name: field.name, value: isChecked } })
          }}
        >
          <SwitchPrimitive.Thumb className="block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
        </SwitchPrimitive.Root>
        <div className="flex gap-4 items-center text-sm leading-tight">
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
