"use client"

import axios from "axios"
import { Form, Formik } from "formik"
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

const FormComponent: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false)

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
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          console.log(values)
          await submitForm(values)
          setFormSubmitted(true)
        } catch (error) {
          console.error("Error submitting form:", error)
        } finally {
          setSubmitting(false)
        }
      }}
    >
      {(formik) => (
        <Form>
          <div className="flex flex-col gap-4 lg:flex-row lg:gap-16">
            <div className="flex grow flex-col lg:max-w-[500px]">
              <SelectInput key="importName" name="importName" label="Select Import Name:" required>
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
            <div className="flex grow flex-col lg:max-w-[350px]">
              <RadioGroup
                key="splitSchedule"
                name="splitSchedule"
                label="Split schedule using social distancing?"
                options={data.splitScheduleOptions}
                required={true}
              />
              <StatusField label="Location Checking:" statusLabel="All Available!" statusColor="text-green-500" />
              <RadioGroup key="client" name="client" label="Client" options={data.clientOptions} required={true} />
              <ClientField testingCenters={data.testingCenterOptions} clients={data.clientsOptions} />
            </div>
          </div>
          <button className="mx-auto mt-4" type="submit" disabled={formik.isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  )
}

export default FormComponent
