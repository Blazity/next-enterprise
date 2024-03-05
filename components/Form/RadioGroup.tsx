import * as RadioGroup from "@radix-ui/react-radio-group"
import { useField } from "formik"
import React from "react"
import ErrorMessage from "./ErrorMessage"
import RequiredAsterisk from "./RequiredAsterisk"
import Separator from "./Separator"

const RadioGroupField = ({
  name,
  label,
  options,
  ...props
}: {
  name: string
  label: string
  options: string[]
  [x: string]: any // Allow any other props
}) => {
  const { required, ...restProps } = props
  const [field, meta, helpers] = useField({ ...restProps, name })

  const handleChange = (value: string) => {
    helpers.setValue(value)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4">
        <Separator/>
        <label className="text-md" htmlFor={label}>
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
