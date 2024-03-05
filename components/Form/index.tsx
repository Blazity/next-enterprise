"use client"

import axios from "axios"
import { Form, Formik, useFormikContext } from "formik"
import React, { useState } from "react"

//Dependencies

//Input fields
import ClientField from "./ClientField"
import { data } from "./data"
import FileInput from "./FileInput"
import { initialValues, validationSchema } from "./formSchemas"
import RadioGroup from "./RadioGroup"
import SelectInput from "./SelectInput"
import StatusField from "./StatusField"
import ToggleField from "./ToggleField"

import { FormValues } from "./types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

{/* Close button */}
const CloseButton: React.FC = () => {
  const { resetForm,setFieldValue } = useFormikContext();
  const handleReset = () => {
    resetForm();
    setFieldValue("manifestFile", "");
  }
  
  return (
    <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-950	text-white" onClick={() => handleReset()}>
      <FontAwesomeIcon icon={faXmark} className="h-6 w-6" />
    </button>
  )
};


const FormComponent: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const submitForm = (values: FormValues) => {
    return axios.post(
      `/api/submitForm`,
      {
        submissionData: values,
      },
      {
        // options
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }

  return (
    <>
    
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          //console.log("Form values:", values); // Log form values on submit
          try {
            //await submitForm(values)
            setFormSubmitted(true)
          } catch (error) {
            console.error("Error submitting form:", error)
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {(formik) => {
          //console.log("Form errors:", formik.errors); // Log form errors on every render
          //console.log("Form values:", formik.values); // Log current form values on every render

          return (
            <Form>
              <CloseButton />
              {/* Title */}
              <div className="flex justify-center mb-12">
                <h1 className="border-grey-300 w-fit border-b pb-4 font-bold text-3xl text-indigo-900">Document Upload</h1>
              </div>
              
              <div className="flex flex-col gap-12">

                {/* Form layout */}
                <div className="flex flex-col gap-4 lg:flex-row lg:gap-16">
                  {/* Left Column */}
                  <div className="flex w-full flex-col lg:w-[500px] gap-5">
                    <SelectInput key="importName" name="importName" required>
                      <option value="">Select Import Name:</option>
                      {data.importNames.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </SelectInput>
                  
                    <FileInput label="Select a manifest that you'd like to import" name="manifestFile" required />
                    
                    <StatusField label="Elapse Data Checking:" statusLabel="No Elapsed Dates!" statusColor="text-green-500" />
                      <ToggleField key="toleranceWindow" name="toleranceWindow" required={true}>
                        Tolerance Window:
                      </ToggleField>
                    
                  </div>
                  {/* Right Column */}
                  <div className="flex w-full flex-col gap-5 lg:w-[350px]">
                    <RadioGroup
                      key="splitSchedule"
                      name="splitSchedule"
                      label="Split schedule using social distancing?"
                      options={data.splitScheduleOptions}
                      required={true}
                    />
                    <StatusField label="Location Checking:" statusLabel="All Available!" statusColor="text-green-500" />
                    <RadioGroup key="client" name="client" label="Client" options={data.clientOptions} required={true} separator />
                    <ClientField testingCenters={data.testingCenterOptions} clients={data.clientsOptions} />
                  </div>
                </div>

                {/* Form Footer */}
                <div className="flex flex-col gap-6">
                  <p className="text-lg leading-tight text-center">Data in the import file is correct. Please press Continue to import.</p>
                  <div className="flex gap-6 justify-center">
                    <button
                        className="flex items-center justify-center rounded-md py-3 px-9 text-center text-sm font-bold transition-all bg-blue-950 text-white min-w-[240px]"
                        type="submit"
                        disabled={formik.isSubmitting}
                    >
                        Continue Import
                        {formik.isSubmitting && <div className="ml-3 h-5 w-5 animate-spin rounded-full border-x-2 border-b-2"></div>}
                    </button>
                    <button
                        className="flex items-center justify-center rounded-md py-3 px-9 text-center text-sm font-bold transition-all border-2 border-amber-500 text-amber-500 min-w-[240px]"
                    >
                        Cancel
                    </button>
                  </div>
                  
                  {formSubmitted && <div className="text-center text-green-500">Success</div>}
                </div>
              </div>

            </Form>
          )
        }
        }
      </Formik>
    </>
  )
}

export default FormComponent
