import { faFile } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useField, useFormikContext } from "formik"
import React, { useRef } from "react"
import ErrorMessage from "./ErrorMessage"
import RequiredAsterisk from "./RequiredAsterisk"

interface FileInputProps {
  label: string
  required?: boolean
  name: string
}

const FileInput: React.FC<FileInputProps> = ({ label, ...props }) => {
  const { required } = props
  const [field, meta] = useField(props)
  const { setFieldValue } = useFormikContext()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    const file = files ? files[0] : null
    setFieldValue(props.name, file) // Directly use setFieldValue to update Formik's state
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const files = event.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      setFieldValue(props.name, file)
    }
  }

  return (
    <div className="mb-4">
      <label className="text-md" htmlFor={props.name}>
        {label}
        <RequiredAsterisk required={required} />
      </label>
      <div className="drop-area" onClick={handleClick} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        <div>
          <FontAwesomeIcon icon={faFile} />
          <h4>Drag & Drop Here or Browse</h4>
        </div>
        <button type="button">Upload Manifest</button>
      </div>
      <input type="file" className="hidden" ref={fileInputRef} onChange={handleChange} />
      <ErrorMessage touched={meta.touched} error={meta.error} />
    </div>
  )
}

export default FileInput
