import * as me from "melonjs"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"

import Layout from "../../components/layout"

export default function Page(props) {
  const [isloaded, setIsLoaded] = React.useState(false)

  useEffect(() => {
    if (!isloaded) {
      console.log("isloaded called")

      setIsLoaded(true)
    }
  })
  const router = useRouter()

  return <></>
}

/**This place should be used to get any information from the server side
 * example : we need to get the session token
 * or any thing related to the page  */

Page.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
