"use client"

import React, { useState } from "react";

//Dependencies
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";

//Input fields
import SelectInput from "./SelectInput";
import RadioGroup from "./RadioGroup";
import FileInput from "./FileInput";
import ToggleField from "./ToggleField";
import StatusField from "./StatusField";
import ClientField from "./ClientField";

interface FormValues {
    importName: string;
    manifestFile: File | null;
    splitSchedule: string;
    client: string; 
    testingCenter: string; 
    toleranceWindow: boolean;
}

const initialValues: FormValues = {
    importName: '',
    manifestFile: null,
    splitSchedule: '',
    client: '',
    testingCenter: '',
    toleranceWindow: false, 
};

const validationSchema = Yup.object({
    importName: Yup.string()
        .required('Import name is required')
        .oneOf(["Import ABC", "Import DEF", "Import GHI"], "Invalid Import Name"),
    manifestFile: Yup.mixed()
        .required('A file is required')
        .nullable(), // Allows for null values, adjust based on your logic for file handling
    splitSchedule: Yup.string()
        .required('This field is required')
        .oneOf(["Yes", "No"], "Invalid Option"),
    client: Yup.string()
        .required('Client selection is required')
        .oneOf(["Single", "Multiple"], "Invalid Client Type"),
    testingCenter: Yup.string()
        .required('Testing center selection is required'), // Assuming a selection is required
    toleranceWindow: Yup.boolean()
        .required('Tolerance window selection is required'), // Assuming this is a boolean represented by a toggle
});


const data = {
    importNames: ["Import ABC", "Import DEF", "Import GHI"],
    splitScheduleOptions: ["Yes", "No"],
    clientOptions: ["Single", "Multiple"],
    testingCenterOptions: ["testing center 1", "testing center 2", "testing center 3", "testing center 4"],
    clientsOptions: ["client 1", "client 2", "client 3"],
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
                    "Content-Type": "application/json"
                }
            }
        );
    };
    
    return (
        <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
            try {
                console.log(values);
                await submitForm(values);
                setFormSubmitted(true);
            } catch (error) {
                console.error("Error submitting form:", error);
            } finally {
                setSubmitting(false);
            }
        }}
    >
        {formik => (
            <Form>
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-16">
                    <div className="flex flex-col grow lg:max-w-[500px]">
                        <SelectInput
                            key="importName"
                            name="importName"
                            label="Select Import Name:"
                            required
                        >
                            <option value="">Select Import Name:</option>
                            {data.importNames.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </SelectInput>
                        <FileInput
                            label="Select a manifest that you'd like to import"
                            name="manifestFile"
                            required
                        />
                          <StatusField 
                          label="Elapse Data Checking:" 
                          statusLabel="No Elapsed Dates!" 
                          statusColor="text-green-500"  
                          />
                        <ToggleField
                            key="toleranceWindow"
                            name="toleranceWindow"
                            required={true}
                        >Tolerance Window:</ToggleField>
                    </div>
                    <div className="flex flex-col grow lg:max-w-[350px]">
                        <RadioGroup
                            key="splitSchedule"
                            name="splitSchedule"
                            label="Split schedule using social distancing?"
                            options={data.splitScheduleOptions}
                            required={true}
                        />
                        <StatusField 
                          label="Location Checking:" 
                          statusLabel="All Available!" 
                          statusColor="text-green-500"  
                          />
                        <RadioGroup
                            key="client"
                            name="client"
                            label="Client"
                            options={data.clientOptions}
                            required={true}
                        />
                        <ClientField
                            testingCenters={data.testingCenterOptions}
                            clients={data.clientsOptions}
                        />
                    </div>
                </div>
                <button
                    className="mx-auto mt-4"
                    type="submit"
                    disabled={formik.isSubmitting}
                >
                    Submit
                </button>
            </Form>
        )}
    </Formik>
    
    )
}

export default FormComponent;

