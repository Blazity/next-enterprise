import React from "react"
import SelectInput from "./SelectInput"
import { Utils } from "./Utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock } from "@fortawesome/free-regular-svg-icons"

// Define a type for your props to improve type-checking
type ClientFieldProps = {
    testingCenters: string[]
    clients: string[]
}

// Destructure the props in the function parameter
const ClientField: React.FC<ClientFieldProps> = ({ testingCenters, clients }) => {
  return (
    <div className="flex flex-col gap-4">
      {testingCenters.map((testingCenter) => (
        <div key={Utils.camelize(testingCenter)} className="flex gap-14 items-center">
          <span>{testingCenter}</span>
          <div className="flex gap-2 items-center">
            <SelectInput name={Utils.camelize(testingCenter)}>
            <option value="">Select Client</option>
            {clients.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectInput>
          <FontAwesomeIcon icon={faClock}/>
        </div>
          
        </div>
      ))}
    </div>
  )
}

export default ClientField
