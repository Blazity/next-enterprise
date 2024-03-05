"use client"

// React and Formik imports
import React, { useState } from "react";
import { Form, Formik } from "formik";
import axios from "axios";

// UI components and utilities
import { Button } from "./Button";
import ClientField from "./ClientField";
import FileInput from "./FileInput";
import RadioGroup from "./RadioGroup";
import SelectInput from "./SelectInput";
import StatusField from "./StatusField";
import ToggleField from "./ToggleField";

// Data and schema and types
import { FormValues } from "./types";
import { data } from "./data";
import { initialValues, validationSchema } from "./formSchemas";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

/**
 * FormComponent: Main form component for document upload.
 * 
 * This component handles the document upload form, including input fields for document details,
 * file upload, and form submission. It uses Formik for form state management and validation,
 * and Axios for submission to a backend endpoint.
 */

const FormComponent: React.FC = () => {
  // State to track if the form has been successfully submitted
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Function to handle form submission
  const submitForm = (values: FormValues) => {
    //TODO implement form submission
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
      {/* Formik setup for handling form state, validation, and submission */}
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
              {/* Close button - allows resetting the form to initial state */}
              <button type="button" className="hidden md:flex h-10 w-10 items-center justify-center rounded-lg bg-blue-950	text-white" onClick={() => formik.resetForm()}>
                <FontAwesomeIcon icon={faXmark} className="h-6 w-6" />
              </button>
              {/* Title - provides context for the form's purpose */}
              <div className="flex justify-center mb-12">
                <h1 className="border-grey-300 w-fit border-b pb-4 font-bold text-3xl text-indigo-900">Document Upload</h1>
              </div>
              
              <div className="flex flex-col gap-12">

                {/* Form layout - organizes the form fields into logical sections */}
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

                {/* Form Footer - contains actions for form submission and cancellation */}
                <div className="flex flex-col gap-6">
                  <p className="text-lg leading-tight text-center">Data in the import file is correct. Please press Continue to import.</p>
                  <div className="flex gap-6 justify-center">
                  <Button 
                  variant="primary"
                  type="submit"
                  disabled={!formik.isValid || !formik.dirty || formik.isSubmitting} >
                    Continue Import
                  </Button>
                  <Button 
                  variant="secondary" 
                  type="button"
                  onClick={() => formik.resetForm()}>
                    Cancel
                  </Button>
                  </div>
                  {/* Success message - Display a success message if the form has been submitted successfully */}
                  {formSubmitted && <div className="sucess-message text-center text-green-500">Success</div>}
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
