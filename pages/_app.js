import { initializeApp } from "firebase/app"
import Head from 'next/head'
import React, { useContext, useEffect, useState } from "react"

//Auth imports
import { AuthContext } from "../context"
import "firebase/auth"
import { getAuth } from "firebase/auth"

//server side rendring things
import { SSRProvider } from "react-bootstrap"

import { ChakraProvider } from "@chakra-ui/react"
import customTheme from "../utils/themes"

function MyApp({ Component, pageProps }) {
  /**Initailize the states
   * Important for keeping data over pages
   */
  const [modelopen, setModelopen] = React.useState(false)
  const [loggedIn, setLoggedIn] = React.useState(false)
  const [acctype, setAcctype] = React.useState(false)
  const [loaded, setLoaded] = React.useState(false)

  ///**This place is for firebase Auth  */

  //initialize firebase
  const firebaseConfig = {
    apiKey: "AIzaSyARcLufTeUZbGue0-k9iZJVxmKlp0l0HQU",
    authDomain: "freebees-24743.firebaseapp.com",
    projectId: "freebees-24743",
    storageBucket: "freebees-24743.appspot.com",
    messagingSenderId: "1084271040061",
    appId: "1:1084271040061:web:91df1dc11b58f5a4807c54",
    measurementId: "G-6Z61GFCN05",
  }

  const app = initializeApp(firebaseConfig)

  const auth = getAuth()

  const setModel = (data) => {
    setModelopen(data)
  }

  const login = () => {
    setLoggedIn(true)
  }

  const logout = () => {
    setLoggedIn(false)
    auth.signOut().then(() => {
      console.log("successfully signed out")
    })
    localStorage.clear()
  }

  const checkType = () => {
    console.log("check")
    if (typeof window != undefined) {
    }
  }

  /////////
  const [registration, setRegistration] = useState(null)

  /**
   * useEffect has been uesd to take actions on the first rendering
   */
  useEffect(() => {
    // const app = initializeApp(firebaseConfig)

    if (!loaded) {
      // console.log("1st check", firebaseConfig)
      
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
          navigator.serviceWorker.register("/sw.js").then(
            function (registration) {
              setRegistration(registration)
              console.log("Service Worker registration successful with scope: ", registration.scope)
            },
            function (err) {}
          )
        })
      }

      setLoaded(true)
    }
  })

  ///// Manual test with console
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
      <ChakraProvider theme={customTheme}>
        <AuthContext.Provider
          value={{
            isLoggedIn: loggedIn,
            firebase: app,
            login: login,
            logout: logout,
            accounttype: acctype,
            modelopen: modelopen,
            setModel: setModel,
            checkType: checkType,
          }}
        >
          {getLayout(<Component {...pageProps} />)}
        </AuthContext.Provider>
      </ChakraProvider>
  )
}

export default MyApp
