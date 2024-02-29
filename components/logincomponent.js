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
import { getAuth, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth"
import { useRouter } from "next/router"
import React, { Component, useContext, useState } from "react"
import FormLabelInput from "./formlabelinput"
import { geturlFormdata } from "../constants"
import { AuthContext } from "../context"

// import Login from "../googlelogin";

export default function Logincomponent(props) {
  const auth = getAuth()

  //for emaillink auth
  const [email, setEmail] = useState("")
  const [linksent, setLinksent] = useState(false)

  //for email password auth
  const [password, setPassword] = useState("")

  const authContext = useContext(AuthContext)
  const router = useRouter()

  const [isloaded, setIsloaded] = useState(false)
  const [emailselect, setEmailselect] = useState(false)

  React.useEffect(() => {
    if (!isloaded) {
      setIsloaded(true)
    }
  })

  // function validateForm() {
  //   return email.length > 0 && password.length > 0
  // }

  // //for email password authentication
  // async function handleSubmit(event) {
  //   event.preventDefault()

  //   var urlForm = geturlFormdata("user", "login")
  //   console.log(email, password)
  //   await getTokens(urlForm.url, email, password).then((value) => {
  //     var idtype = null
  //     if (email.includes("@")) {
  //       idtype = "email"
  //     } else {
  //       idtype = "phone"
  //     }

  //     // getuserdata(idtype , email).then((value)=>{
  //     //   router.push(`/home`)
  //     // })
  //   })
  // }

  const onSignInSubmit = () => {}

  const onEmailSubmit = () => {
    setEmailselect(true)
  }

  /////////////////////////////
  //email link auth

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    // url: `${siterooturl}login`,

    url: `http://localhost:3000/login`,

    // // This must be true.
    handleCodeInApp: true,
    // iOS: {
    //   bundleId: 'com.example.ios'
    // },
    // android: {
    //   packageName: 'com.example.android',
    //   installApp: true,
    //   minimumVersion: '12'
    // },
    //  dynamicLinkDomain: 'example.page.link'
  }

  const sighinWithCreds = async (email, password) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    console.log(response.ok)
    if (response.ok) {
      router.push("/home")
    } else {
      // Handle errors
    }
  }

  const signinWithLink = async () => {
    console.log(auth, email, actionCodeSettings)
    await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.

        setLinksent(true)

        // ...
      })
      .catch((error) => {
        console.log(error)
        console.log("error sending link")
        const errorCode = error.code
        const errorMessage = error.message
        // ...
      })
  }

  if (isloaded && isSignInWithEmailLink(auth, window.location.href)) {
    // Additional state parameters can also be passed via URL.
    // This can be used to continue the user's intended action before triggering
    // the sign-in operation.
    // Get the email if available. This should be available if the user completes
    // the flow on the same device where they started it.

    console.log(email)
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      // email = window.prompt('Please provide your email for confirmation');
    }
    // The client SDK will parse the code from the link for you.
    signInWithEmailLink(auth, email, window.location.href)
      .then((result) => {
        // Clear email from storage.
        console.log("logged in")

        //  result.user.providerData
        onSuccess(result)
        // window.localStorage.removeItem('emailForSignIn');

        //router.push('/home')
        // You can access the new user via result.user

        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
      })
      .catch((error) => {
        console.log(error)
        onFailure()
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
      })
  }

  const onSuccess = (res) => {
    console.log(res)
    // verifyonServer(res._tokenResponse.idToken, "email", res.user.email, res)
  }

  const onFailure = () => {
    alert(`Something went Wrong. Try again `)
  }
  const confirmCode = (code) => {
    // confirmationResult.confirm(code).then((result) => {
    //   // User signed in successfully.
    //   const user = result.user;
    //   // ...
    // }).catch((error) => {
    //   // User couldn't sign in (bad verification code?)
    //   // ...
    // });
  }

  const handleEmailChange = (val) => {
    setEmail(val)
  }
  const handlePasswordChange = (val) => {
    setPassword(val)
  }

  console.log(password)
  return (
    <Box
      w={["80%", "60%", "40%"]}
      align="center"
      bgGradient="linear(to-b, blue.200, blue.500)"
      padding={10}
      borderRadius={10}
      margin="auto"
    >
      {!linksent && (
        <>
          <FormLabel margin={"auto"} padding={"auto"} textAlign={"center"}>
            Log in
          </FormLabel>
          <FormControl className={"form-group"}>
            <FormLabelInput
              inputtype="email"
              label="Email*"
              placeholder="abc@xyz.uvw"
              onChange={(e) => handleEmailChange(e)}
            />

            <FormLabelInput
              inputtype="password"
              label="Password"
              placeholder="type your password"
              onChange={(e) => handlePasswordChange(e)}
            />
          </FormControl>
          <Button className="btn" onClick={() => sighinWithCreds(email, password)}>
            Log in
          </Button>

          <p>--- or ---</p>
          <Button className="btn" onClick={signinWithLink}>
            Continue with signin link
          </Button>

          {/* <p >Sign in with</p>  */}
          {/* <Login />  */}
        </>
      )}

      {linksent && (
        <>
          <h4>Signin Link sent</h4>
          <div className={"form-group"}>
            <div style={{ marginBlock: "10%" }}>Check your provided email , And Click on the Link to verify </div>
            <h3>WE are already waiting for you</h3>
          </div>
        </>
      )}
    </Box>
  )
}
