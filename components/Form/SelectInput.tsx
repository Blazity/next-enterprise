import { useField } from "formik"
import React from "react"
import ErrorMessage from "./ErrorMessage"
import RequiredAsterisk from "./RequiredAsterisk"

const SelectInput = ({ label, ...props }: { label?: string; name: string; [x: string]: any }) => {
  // Since `useField` only needs `name`, and optionally `type` and `value`, we destruct those from props
  const { required, ...restProps } = props
  const [field, meta] = useField(restProps)

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="text-md" htmlFor={props.id || props.name}>
          {label}
          <RequiredAsterisk required={required} />
        </label>
      )}

      <div className="flex flex-col">
        <select className="h-10 w-full rounded-lg border border-grey-500 px-4 text-sm" {...field} {...restProps} />
        <ErrorMessage touched={meta.touched} error={meta.error} />
      </div>
      
      
    </div>
  )
}

export default SelectInput
