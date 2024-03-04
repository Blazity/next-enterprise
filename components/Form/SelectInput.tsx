import { useField } from "formik"
import React from "react"
import ErrorMessage from "./ErrorMessage"
import RequiredAsterisk from "./RequiredAsterisk"

const SelectInput = ({ label, ...props }: { label?: string; name: string; [x: string]: any }) => {
  const { required, ...restProps } = props
  const [field, meta] = useField(restProps)

  return (
    <div className="">
      {label && (
        <label className="text-md" htmlFor={props.id || props.name}>
          {label}
        </label>
      )}
      <RequiredAsterisk required={required} />
      <select className="h-10 w-full rounded-lg border px-3 text-base shadow-sm" {...field} {...restProps} />
      <ErrorMessage touched={meta.touched} error={meta.error} />
    </div>
  )
}

export default SelectInput
