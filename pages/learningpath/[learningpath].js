import { Button, Error, Grid, Spinner } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"
import Layout from "../../components/layout"

import { learningitemfetcher } from "../../datafetch/datafetch"

/**
 * params -
 *    length of path - plength ( the number of tasks )
 *    structure of the path - DAG
 *    type of path to be formed - pathtype
 */

function Menubox(props) {
  const { data, isLoading, isError } = learningitemfetcher()
  const [showedcount, setShowedcount] = React.useState(40)

  const router = useRouter()
  if (isLoading) return <Spinner />
  if (isError) return <Error />

  const container = (
    <>
      <Grid templateColumns="repeat(10, 1fr)" padding="70" gap={10}>
        {data.slice(0, showedcount).map((item) => {
          if ([1, 22, 3, 24, 5, 26].includes(item.id)) {
            return (
              <div
                key={item.id}
                style={{ backgroundColor: "red", height: 100 }}
                onClick={() => {
                  router.push(`/learningpage/${item.id}`)
                }}
              ></div>
            )
          }
          return <div key={100} style={{ backgroundColor: "white", height: 100 }}></div>
        })}
      </Grid>
    </>
  )
  return container
}

export default function LearningPath(props) {
  const [isloaded, setIsLoaded] = React.useState(false)

  useEffect(() => {
    if (!isloaded) {
      console.log("isloaded called")

      setIsLoaded(true)
    }
  })

  return (
    <>
      <Menubox />
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

LearningPath.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
