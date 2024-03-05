/**
 * RadioGroupField Component
 *
 * Renders a group of radio buttons using Radix UI with Formik integration.
 * Supports custom options, labels, and an optional separator.
 */

import * as RadioGroup from "@radix-ui/react-radio-group"
import { useField } from "formik"
import React from "react"
import ErrorMessage from "./ErrorMessage"
import RequiredAsterisk from "./RequiredAsterisk"
import Separator from "./Separator"

/**
 * Props for RadioGroupField.
 *
 * @param name The name attribute for the radio group, used for form submission.
 * @param label Display label for the radio group.
 * @param separator Optional boolean to render a visual separator above the radio group.
 * @param options Array of option strings that the radio group will display.
 * @param props Additional props passed to the radio group, including `required`.
 */

interface RadioGroupFieldProps {
  name: string;
  label: string;
  separator?: boolean;
  options: string[];
  [key: string]: any; // This allows for additional props not explicitly defined in the interface.
}

const RadioGroupField: React.FC<RadioGroupFieldProps> = ({
  name,
  label,
  separator,
  options,
  ...props
}) => {
  const { required, ...restProps } = props

  // State and helpers from Formik for managing radio group value
  const [field, meta, helpers] = useField({ ...restProps, name })

  // Handles radio option change, updating Formik's state
  const handleChange = (value: string) => {
    helpers.setValue(value)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4">
        {separator && <Separator/>}
        <label className="font-bold text-sm leading-tight text-indigo-900" htmlFor={label}>
          {label}
          <RequiredAsterisk required={required} />
        </label>
      </div>
      
      <RadioGroup.Root className="flex gap-3" value={field.value} onValueChange={handleChange} aria-label={label}>
        {options.map((option) => (
          <div className="flex items-center" key={option}>
            <RadioGroup.Item
              className="hover:bg-violet3 h-[25px] w-[25px] cursor-default rounded-full border bg-white outline-none focus:shadow-[0_0_0_2px]"
              value={option}
              id={`${name}-${option}`}
            >
              <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-[11px] after:w-[11px] after:rounded-[50%] after:bg-blue-950 after:content-['']" />
            </RadioGroup.Item>
            <label className="pl-[15px] text-[15px] leading-none" htmlFor={`${name}-${option}`}>
              {option}
            </label>
          </div>
        ))}
      </RadioGroup.Root>
      <ErrorMessage touched={meta.touched} error={meta.error} />
    </div>
  )
}

export default RadioGroupField
