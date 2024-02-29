import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  Stack,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import React, { useState } from "react"
import FormLabelInput from "./formlabelinput"
import { geturlFormdata, siterooturl } from "../constants"

export default function Signupcomponent(props) {
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirm_password, setConfirmPassword] = React.useState("")
  const router = useRouter()

  const [show, setShow] = useState(true)

  const validateForm = () => {
    return email.length > 0 && (phone.length >= 10 || phone.length == 0) && password.length > 0
  }

  const handleSubmit = (event) => {
    console.log(email, password, confirm_password, phone)
    if (phone.length > 0 && phone.length < 10) {
      //popup
    }
    event.preventDefault()
    var urlForm
    if (email.length == 0) {
      urlForm = geturlFormdata("user", "signup", {}, { phone: phone, password: password })
    } else if (phone.length == 0) {
      urlForm = geturlFormdata("user", "signup", {}, { mail: email, password: password })
    } else {
      urlForm = geturlFormdata("user", "signup", {}, { mail: email, phone: phone, password: password })
    }

    if (password !== confirm_password) {
      setShow(true)
      return
    }
    try {
      // postsignup(urlForm.url, urlForm.formdata).then(() => {
      //   router.push("/info")
      // })
    } catch (e) {}
  }

  const handleEmailChange = (val) => {
    setEmail(val)
  }
  const handlePhoneChange = (val) => {
    setPhone(val)
  }
  const handlePasswordChange = (val) => {
    setPassword(val)
  }
  const handleConfirmPasswordChange = (val) => {
    setConfirmPassword(val)
  }

  return (
    <Box
      w="50%"
      align="center"
      bgGradient="linear(to-b, blue.200, blue.500)"
      padding={10}
      borderRadius={10}
      margin="auto"
    >
      <FormControl onSubmit={handleSubmit} align="center">
        <FormLabel margin={"auto"} padding={"auto"} textAlign={"center"}>
          Register
        </FormLabel>

        <FormLabelInput
          inputtype="email"
          label="Email*"
          placeholder="abc@xyz.uvw"
          onChange={(e) => handleEmailChange(e)}
        />

        <FormLabelInput
          inputtype="number"
          label="Phone"
          placeholder="XXXXXXXXXX"
          onChange={(e) => handlePhoneChange(e)}
        />

        <FormLabelInput
          inputtype="password"
          label="Password"
          placeholder="type your password"
          onChange={(e) => handlePasswordChange(e)}
        />

        <FormLabelInput
          inputtype="password"
          label="Confirm Password"
          placeholder="type your password again"
          onChange={(e) => handleConfirmPasswordChange(e)}
        />

        <Button type="submit" margin="auto" marginY="10px" disabled={!validateForm()} onClick={handleSubmit}>
          Register
        </Button>

        <FormLabel margin={"auto"} align="center" textAlign={"center"}>
          Already registered?{" "}
          <Link href={`${siterooturl}login`} color="black.500" _hover={{ color: "blue.800", fontSize: "130%" }}>
            log in
          </Link>
        </FormLabel>
      </FormControl>
    </Box>
  )
}
