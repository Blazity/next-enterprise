import { Box, Flex, FormLabel, Input, Spacer } from "@chakra-ui/react"
import { Hide, Show } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
/**
 * Component used to generate a form input
 * props -
 *      label
 *      inputtype
 *      placeholder
 *      onChange = the handler function to get the changed data
 */
export default function FormLabelInput(props) {
  const [data, setData] = React.useState("")

  const handlepassChange = (data) => {
    props.onChange(data)
  }
  useEffect(() => {
    handlepassChange(data)
  })
  return (
    <Flex direction={["column", "column", "row", "row"]} alignItems="center" marginY={5}>
      <Box flexBasis={0} flexGrow={1}>
        <Hide below="md">
          <FormLabel margin={"auto"} whiteSpace={"nowrap"} textAlign={"left"}>
            {props.label}
          </FormLabel>
        </Hide>
      </Box>

      <Box flexBasis={0} flexGrow={1}>
        <Input
          type={props.inputtype}
          placeholder={props.placeholder}
          bgColor={"white"}
          value={data}
          onChange={(e) => {
            setData(e.target.value)
          }}
        />
      </Box>
    </Flex>
  )
}
