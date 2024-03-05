/**
 * ClientField Component
 * 
 * Renders a list of testing centers with associated client selection inputs.
 * Each testing center allows for the selection of a client from a provided list.
 */

import { faClock } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import SelectInput from "./SelectInput"
import { Utils } from "./Utils"

/**
 * Props for ClientField component.
 * 
 * @param testingCenters Array of testing center names to be displayed.
 * @param clients Array of client names available for selection.
 */

type ClientFieldProps = {
  testingCenters: string[]
  clients: string[]
}

const ClientField: React.FC<ClientFieldProps> = ({ testingCenters, clients }) => {
  return (
    <div className="flex flex-col gap-4 text-sm leading-tight">
      {/* Render a selection input for each testing center, allowing a client to be chosen for each. */}
      {testingCenters.map((testingCenter) => (
        <div key={Utils.camelize(testingCenter)} className="flex items-center gap-4 md:gap-14">
          <span>{testingCenter}</span>
          <div className="flex items-center gap-2">
            <SelectInput name={Utils.camelize(testingCenter)}>
              <option value="">Select Client</option>
              {clients.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectInput>
            <FontAwesomeIcon icon={faClock} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ClientField
