import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"
import Layout from "../components/layout"

import Logincomponent from "../components/logincomponent"
import Signupcomponent from "../components/signupcomponent"

export default function Login(props) {
  const [isloaded, setIsLoaded] = React.useState(false)

  useEffect(() => {
    if (!isloaded) {
      console.log("isloaded called")

      setIsLoaded(true)
    }
  })

  const router = useRouter()
  return (
    <>
      <Logincomponent />
      <button onClick={() => router.push("/menu")}>Click here to read menu</button>
    </>
  )
}

/**This place should be used to get any information from the server side
 * example : we need to get the session token
 * or any thing related to the page  */
export async function getServerSideProps() {
  const data = await fetch("https://jsonplaceholder.typicode.com/todos").then((response) => {
    response.json()
  })

  return { props: { title: "rahul" } }
}

Login.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
